/**
 * 역할: comments 테이블 관련 Supabase 호출을 담당하는 파일입니다.
 *
 * 이 파일에서 할 수 있는 것:
 * 1. fetchComments   — 게시물의 댓글 목록 조회
 * 2. createComment   — 댓글 작성 + 게시물 작성자에게 알림 발송
 * 3. deleteComment   — 댓글 삭제
 * 4. fetchCommentCount — 게시물의 댓글 수 조회
 *
 * 연동 테이블:
 * - comments     : 댓글 내용 (post_id + author_id)
 * - profiles     : 댓글 작성자 프로필 (join)
 * - activity_logs: 댓글 시 게시물 작성자에게 알림 생성
 */
import { supabase } from '../lib/supabase';
import { createNotification } from './notificationService';

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────

/**
 * comments 테이블 한 행의 구조입니다.
 */
export type CommentRow = {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
};

/**
 * 화면에서 사용하는 댓글 타입입니다.
 * 댓글 작성자의 프로필 정보가 포함됩니다.
 */
export type CommentWithAuthor = CommentRow & {
  // 댓글 작성자의 프로필 (profiles 테이블 join)
  author: {
    id: string;
    nickname: string;
    avatar_url: string | null;
  } | null;
};

// ─────────────────────────────────────────────
// 공개 함수
// ─────────────────────────────────────────────

/**
 * 1. 게시물의 댓글 목록을 가져옵니다.
 *
 * 동작 흐름:
 * 1) comments 테이블에서 post_id가 일치하는 댓글을 조회합니다.
 * 2) 각 댓글의 작성자 프로필(profiles)을 함께 가져옵니다.
 * 3) 오래된 댓글이 위에 오도록 오름차순으로 정렬합니다.
 *    (일반적인 댓글 UI는 오래된 것이 위, 최신이 아래입니다.)
 *
 * @param postId - 댓글을 조회할 게시물의 UUID
 */
export async function fetchComments(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      post_id,
      author_id,
      content,
      created_at,
      author:profiles!comments_author_id_fkey (
        id,
        nickname,
        avatar_url
      )
    `)
    .eq('post_id', postId)
    // 오래된 댓글이 위에 오도록 오름차순 정렬합니다.
    .order('created_at', { ascending: true });

  if (error) {
    return { data: null, error };
  }

  return {
    data: (data ?? []) as unknown as CommentWithAuthor[],
    error: null,
  };
}

/**
 * 2. 댓글을 작성합니다.
 *
 * 동작 흐름:
 * 1) comments 테이블에 새 행을 INSERT 합니다.
 * 2) 게시물 작성자에게 알림을 발송합니다.
 *    (본인 게시물에 댓글을 달면 알림을 보내지 않습니다.)
 *
 * 사용 예:
 *   const { data, error } = await createComment(userId, {
 *     postId: '게시물-uuid',
 *     content: '멋진 사진이에요!',
 *     postAuthorId: '게시물-작성자-uuid',
 *   });
 *
 * @param userId - 댓글을 작성하는 사람(현재 로그인한 유저)의 UUID
 * @param params.postId       - 댓글을 달 게시물의 UUID
 * @param params.content      - 댓글 내용
 * @param params.postAuthorId - 게시물 작성자의 UUID (알림 발송 대상)
 */
export async function createComment(
  userId: string,
  params: {
    postId: string;
    content: string;
    postAuthorId: string;
  }
) {
  // 댓글 내용이 빈 문자열이면 저장하지 않습니다.
  if (!params.content.trim()) {
    return { data: null, error: new Error('댓글 내용을 입력해주세요.') };
  }

  // ① 댓글 저장
  const { data: comment, error } = await supabase
    .from('comments')
    .insert({
      post_id: params.postId,
      author_id: userId,
      content: params.content.trim(), // 앞뒤 공백 제거
    })
    .select(`
      id,
      post_id,
      author_id,
      content,
      created_at,
      author:profiles!comments_author_id_fkey (
        id,
        nickname,
        avatar_url
      )
    `)
    .single();

  if (error) {
    return { data: null, error };
  }

  // ② 게시물 작성자에게 알림 발송
  // 본인 게시물에 댓글을 달 때는 알림을 보내지 않습니다.
  if (userId !== params.postAuthorId) {
    await createNotification({
      userId,
      receiverId: params.postAuthorId,
      action: 'comment',
      targetType: 'post',
      targetId: params.postId,
    });
  }

  return {
    data: comment as unknown as CommentWithAuthor,
    error: null,
  };
}

/**
 * 3. 댓글을 삭제합니다.
 *
 * 삭제 권한:
 * - 댓글 작성자(author_id = 나)만 삭제 가능합니다.
 * → RLS 정책 "comments_delete"에서 자동으로 처리됩니다.
 *
 * @param commentId - 삭제할 댓글의 UUID
 */
export async function deleteComment(commentId: string) {
  return supabase
    .from('comments')
    .delete()
    .eq('id', commentId);
}

/**
 * 4. 게시물의 댓글 수를 가져옵니다.
 *
 * 언제 쓰나?
 * - 피드에서 "댓글 N개" 를 빠르게 표시할 때 씁니다.
 * - fetchFeed(postService.ts)에서는 join으로 한 번에 가져오므로
 *   별도로 호출할 일은 적습니다.
 *
 * @param postId - 댓글 수를 조회할 게시물의 UUID
 */
export async function fetchCommentCount(postId: string): Promise<number> {
  const { count } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  return count ?? 0;
}
