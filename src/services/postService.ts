/**
 * 역할: posts 테이블 관련 Supabase 호출을 담당하는 파일입니다.
 *
 * 이 파일에서 할 수 있는 것:
 * 1. fetchFeed          — 그룹의 게시물 피드 조회 (최신순)
 * 2. fetchPostById      — 게시물 단건 상세 조회
 * 3. fetchMyPosts       — 내가 작성한 게시물 목록 조회
 * 4. createPost         — 게시물 작성
 * 5. updatePost         — 게시물 수정
 * 6. deletePost         — 게시물 삭제
 *
 * 연동 테이블:
 * - posts   : 게시물 기본 정보
 * - profiles: 작성자 프로필 (join)
 * - media   : 첨부 미디어 (join)
 * - likes   : 좋아요 수 집계
 * - comments: 댓글 수 집계
 */
import { supabase } from '../lib/supabase';
import { createNotification } from './notificationService';

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────

/**
 * posts 테이블 한 행의 구조입니다.
 */
export type PostRow = {
  id: string;
  group_id: string;
  author_id: string;
  title: string;
  body: string;
  location_name: string;
  created_at: string;
  updated_at: string;
};

/**
 * 피드/상세 화면에서 사용하는 게시물 타입입니다.
 * 작성자 프로필, 미디어 목록, 좋아요 수, 댓글 수를 포함합니다.
 */
export type PostWithDetails = PostRow & {
  // 작성자 프로필 (profiles 테이블 join)
  author: {
    id: string;
    nickname: string;
    avatar_url: string | null;
  } | null;
  // 첨부된 미디어 목록 (media 테이블 join)
  media: {
    id: string;
    url: string;
    thumbnail_url: string | null;
    media_type: string;
    caption: string | null;
  }[];
  // 좋아요 수 (likes 테이블 집계)
  like_count: number;
  // 댓글 수 (comments 테이블 집계)
  comment_count: number;
};

/**
 * createPost 함수에 넘기는 입력 타입입니다.
 */
export type CreatePostInput = {
  groupId: string;
  title?: string;
  body?: string;
  locationName?: string;
};

/**
 * updatePost 함수에 넘기는 수정 가능 필드 타입입니다.
 */
export type UpdatePostInput = {
  title?: string;
  body?: string;
  location_name?: string;
};

// ─────────────────────────────────────────────
// 공개 함수
// ─────────────────────────────────────────────

/**
 * 1. 그룹의 게시물 피드를 최신순으로 가져옵니다.
 *
 * 동작 흐름:
 * 1) posts 테이블에서 group_id가 일치하는 게시물을 조회합니다.
 * 2) 작성자 프로필(profiles), 첨부 미디어(media)를 함께 가져옵니다.
 * 3) 좋아요 수(likes)와 댓글 수(comments)도 집계해서 포함합니다.
 * 4) 최신 게시물이 위에 오도록 내림차순 정렬합니다.
 *
 * @param groupId - 피드를 조회할 그룹의 UUID
 * @param limit   - 한 번에 가져올 최대 게시물 수 (기본값 20)
 * @param offset  - 건너뛸 게시물 수 (무한 스크롤 구현 시 사용)
 */
export async function fetchFeed(groupId: string, limit = 20, offset = 0) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      group_id,
      author_id,
      title,
      body,
      location_name,
      created_at,
      updated_at,
      author:profiles!posts_author_id_fkey (
        id,
        nickname,
        avatar_url
      ),
      media (
        id,
        url,
        thumbnail_url,
        media_type,
        caption
      ),
      likes (count),
      comments (count)
    `)
    .eq('group_id', groupId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1); // range(0, 19) → 20건

  if (error) {
    return { data: null, error };
  }

  // Supabase count 집계 결과를 숫자로 변환합니다.
  // likes(count) 결과는 [{ count: 3 }] 형태로 오므로 꺼내서 숫자로 바꿉니다.
  const posts = (data ?? []).map((post) => ({
    ...post,
    author: (post.author as unknown) as PostWithDetails['author'],
    media: (post.media as unknown) as PostWithDetails['media'],
    like_count: Array.isArray(post.likes)
      ? (post.likes[0] as unknown as { count: number })?.count ?? 0
      : 0,
    comment_count: Array.isArray(post.comments)
      ? (post.comments[0] as unknown as { count: number })?.count ?? 0
      : 0,
  })) as PostWithDetails[];

  return { data: posts, error: null };
}

/**
 * 2. 게시물 단건 상세 정보를 가져옵니다.
 *
 * 언제 쓰나?
 * - 게시물 카드를 클릭했을 때 상세 화면에서 전체 내용을 표시할 때 씁니다.
 *
 * @param postId - 조회할 게시물의 UUID
 */
export async function fetchPostById(postId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      group_id,
      author_id,
      title,
      body,
      location_name,
      created_at,
      updated_at,
      author:profiles!posts_author_id_fkey (
        id,
        nickname,
        avatar_url
      ),
      media (
        id,
        url,
        thumbnail_url,
        media_type,
        caption
      ),
      likes (count),
      comments (count)
    `)
    .eq('id', postId)
    .maybeSingle();

  if (error || !data) {
    return { data: null, error: error ?? new Error('게시물을 찾을 수 없습니다.') };
  }

  const post: PostWithDetails = {
    ...(data as unknown as PostRow),
    author: (data.author as unknown) as PostWithDetails['author'],
    media: (data.media as unknown) as PostWithDetails['media'],
    like_count: Array.isArray(data.likes)
      ? (data.likes[0] as unknown as { count: number })?.count ?? 0
      : 0,
    comment_count: Array.isArray(data.comments)
      ? (data.comments[0] as unknown as { count: number })?.count ?? 0
      : 0,
  };

  return { data: post, error: null };
}

/**
 * 3. 내가 작성한 게시물 목록을 가져옵니다.
 *
 * 언제 쓰나?
 * - 마이페이지에서 "내가 올린 게시물" 목록을 표시할 때 씁니다.
 *
 * @param userId - 현재 로그인한 유저의 UUID
 * @param limit  - 한 번에 가져올 최대 건수 (기본값 30)
 */
export async function fetchMyPosts(userId: string, limit = 30) {
  return supabase
    .from('posts')
    .select(`
      id,
      group_id,
      author_id,
      title,
      body,
      location_name,
      created_at,
      updated_at,
      media (
        id,
        url,
        thumbnail_url,
        media_type
      )
    `)
    .eq('author_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
    .returns<(PostRow & { media: PostWithDetails['media'] })[]>();
}

/**
 * 4. 게시물을 작성합니다.
 *
 * 동작 흐름:
 * 1) posts 테이블에 새 행을 INSERT 합니다.
 * 2) 같은 그룹의 다른 멤버들에게 알림을 보냅니다.
 *    (그룹 멤버 조회 후 나를 제외한 전원에게 'post_created' 알림 생성)
 *
 * 왜 알림을 여기서 보내나?
 * - 게시물 작성이라는 하나의 행동에 "저장"과 "알림"이 묶여있는 게 자연스럽습니다.
 * - 화면에서는 createPost 하나만 호출하면 됩니다.
 *
 * @param userId - 게시물을 작성하는 사람(현재 로그인한 유저)의 UUID
 * @param input  - 게시물 내용
 */
export async function createPost(userId: string, input: CreatePostInput) {
  // ① 게시물 저장
  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      group_id: input.groupId,
      author_id: userId,
      title: input.title ?? '',
      body: input.body ?? '',
      location_name: input.locationName ?? '',
    })
    .select('id, group_id, author_id, title, body, location_name, created_at, updated_at')
    .single<PostRow>();

  if (error || !post) {
    return { data: null, error: error ?? new Error('게시물 작성에 실패했습니다.') };
  }

  // ② 같은 그룹의 다른 멤버들에게 알림 발송
  // 그룹 멤버 목록을 가져와서 나를 제외한 멤버에게 알림을 만듭니다.
  const { data: members } = await supabase
    .from('group_members')
    .select('user_id')
    .eq('group_id', input.groupId)
    .neq('user_id', userId); // 나 자신은 제외

  if (members && members.length > 0) {
    // 멤버 수만큼 알림 행을 한 번에 insert합니다.
    const notifications = members.map((m) => ({
      user_id: userId,
      receiver_id: m.user_id,
      action: 'post_created',
      target_type: 'post',
      target_id: post.id,
    }));
    await supabase.from('activity_logs').insert(notifications);
  }

  return { data: post, error: null };
}

/**
 * 5. 게시물을 수정합니다.
 *
 * 수정 가능한 필드: title(제목), body(내용), location_name(위치)
 * 수정 권한: 본인(author_id = 나)만 가능 — RLS 정책으로 자동 보장됩니다.
 *
 * @param postId - 수정할 게시물의 UUID
 * @param fields - 수정할 필드와 값
 */
export async function updatePost(postId: string, fields: UpdatePostInput) {
  return supabase
    .from('posts')
    .update({
      ...fields,
      updated_at: new Date().toISOString(),
    })
    .eq('id', postId)
    .select('id, group_id, author_id, title, body, location_name, created_at, updated_at')
    .single<PostRow>();
}

/**
 * 6. 게시물을 삭제합니다.
 *
 * 삭제 권한:
 * - 게시물 작성자(author_id = 나)
 * - 그룹 owner 또는 admin
 * → RLS 정책 "posts_delete"에서 자동으로 처리됩니다.
 *
 * cascade 동작:
 * - posts 삭제 시 연결된 media, comments, likes도 자동 삭제됩니다.
 *   (supabase_schema.sql의 on delete cascade 설정 덕분입니다.)
 *
 * @param postId - 삭제할 게시물의 UUID
 */
export async function deletePost(postId: string) {
  return supabase
    .from('posts')
    .delete()
    .eq('id', postId);
}
