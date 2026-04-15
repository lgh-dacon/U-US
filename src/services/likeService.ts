/**
 * 역할: likes 테이블 관련 Supabase 호출을 담당하는 파일입니다.
 *
 * 이 파일에서 할 수 있는 것:
 * 1. toggleLike     — 좋아요 추가 또는 취소 (토글)
 * 2. fetchLikeCount — 게시물의 좋아요 수 조회
 * 3. fetchIsLiked   — 내가 이 게시물에 좋아요를 눌렀는지 여부 확인
 * 4. fetchLikers    — 게시물에 좋아요 누른 사람 목록 조회
 *
 * 연동 테이블:
 * - likes        : 좋아요 기록 (post_id + user_id 조합이 unique)
 * - activity_logs: 좋아요 시 게시물 작성자에게 알림 생성
 */
import { supabase } from '../lib/supabase';
import { createNotification } from './notificationService';

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────

/**
 * likes 테이블 한 행의 구조입니다.
 */
export type LikeRow = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

/**
 * toggleLike 반환값의 구조입니다.
 *
 * liked: true → 방금 좋아요를 눌렀음 (추가됨)
 * liked: false → 방금 좋아요를 취소했음 (삭제됨)
 */
export type ToggleLikeResult = {
  liked: boolean;   // 현재 좋아요 상태 (true = 좋아요 중, false = 취소됨)
  count: number;    // 변경 후 현재 좋아요 수
  error: Error | null;
};

// ─────────────────────────────────────────────
// 공개 함수
// ─────────────────────────────────────────────

/**
 * 1. 좋아요를 추가하거나 취소합니다 (토글).
 *
 * 동작 흐름:
 * 1) 이미 좋아요를 눌렀는지 확인합니다.
 * 2) 눌렀으면 → 삭제 (취소)
 *    안 눌렀으면 → 삽입 (추가) + 게시물 작성자에게 알림 발송
 * 3) 변경 후 최신 좋아요 수를 반환합니다.
 *
 * 왜 토글 방식인가?
 * - 좋아요 버튼 하나로 추가/취소를 모두 처리할 수 있어서 화면 코드가 단순해집니다.
 * - 화면에서는 toggleLike 하나만 호출하면 됩니다.
 *
 * 사용 예:
 *   const result = await toggleLike(userId, postId, postAuthorId);
 *   if (result.liked) {
 *     setLikeCount(result.count);
 *     // ❤️ 좋아요 아이콘 채우기
 *   } else {
 *     setLikeCount(result.count);
 *     // 🤍 좋아요 아이콘 비우기
 *   }
 *
 * @param userId       - 현재 로그인한 유저의 UUID (좋아요를 누르는 사람)
 * @param postId       - 좋아요를 누를 게시물의 UUID
 * @param postAuthorId - 게시물 작성자의 UUID (알림 발송 대상)
 */
export async function toggleLike(
  userId: string,
  postId: string,
  postAuthorId: string
): Promise<ToggleLikeResult> {
  // ① 이미 좋아요를 눌렀는지 확인합니다.
  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();

  let liked: boolean;

  if (existing) {
    // ②-A 이미 좋아요 상태 → 삭제(취소)
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('id', existing.id);

    if (error) {
      return { liked: true, count: 0, error };
    }

    liked = false; // 취소됨

  } else {
    // ②-B 아직 좋아요 안 한 상태 → 추가
    const { error } = await supabase
      .from('likes')
      .insert({
        post_id: postId,
        user_id: userId,
      });

    if (error) {
      return { liked: false, count: 0, error };
    }

    liked = true; // 추가됨

    // 게시물 작성자에게 알림 발송
    // (본인 게시물에 좋아요를 눌렀을 때는 알림을 보내지 않습니다.)
    if (userId !== postAuthorId) {
      await createNotification({
        userId,
        receiverId: postAuthorId,
        action: 'like',
        targetType: 'post',
        targetId: postId,
      });
    }
  }

  // ③ 최신 좋아요 수를 집계해서 반환합니다.
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true }) // head: true → 데이터 없이 count만 가져옵니다.
    .eq('post_id', postId);

  return { liked, count: count ?? 0, error: null };
}

/**
 * 2. 게시물의 좋아요 수를 가져옵니다.
 *
 * 언제 쓰나?
 * - 피드나 게시물 카드에서 숫자만 빠르게 표시할 때 씁니다.
 * - toggleLike가 이미 count를 반환하므로, 별도로 호출할 일은 적습니다.
 *
 * @param postId - 좋아요 수를 조회할 게시물의 UUID
 */
export async function fetchLikeCount(postId: string): Promise<number> {
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  return count ?? 0;
}

/**
 * 3. 내가 이 게시물에 좋아요를 눌렀는지 확인합니다.
 *
 * 언제 쓰나?
 * - 화면에서 처음 렌더링할 때 좋아요 버튼의 초기 상태(눌렀는지/안 눌렀는지)를 설정할 때 씁니다.
 *
 * 반환값:
 * - true  → 좋아요를 누른 상태
 * - false → 좋아요를 안 누른 상태
 *
 * @param userId - 현재 로그인한 유저의 UUID
 * @param postId - 확인할 게시물의 UUID
 */
export async function fetchIsLiked(userId: string, postId: string): Promise<boolean> {
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();

  return !!data; // 행이 있으면 true, 없으면 false
}

/**
 * 4. 게시물에 좋아요를 누른 사람 목록을 가져옵니다.
 *
 * 언제 쓰나?
 * - "좋아요 누른 사람" 목록을 팝업이나 별도 화면으로 보여줄 때 씁니다.
 *
 * @param postId - 좋아요 목록을 조회할 게시물의 UUID
 * @param limit  - 가져올 최대 건수 (기본값 50)
 */
export async function fetchLikers(postId: string, limit = 50) {
  return supabase
    .from('likes')
    .select(`
      id,
      created_at,
      user:profiles!likes_user_id_fkey (
        id,
        nickname,
        avatar_url
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
    .limit(limit);
}
