/**
 * 역할: 내가 받은 알림 목록을 조회하는 파일입니다.
 *
 * 알림이란?
 * - 다른 유저가 내 게시물에 좋아요를 눌렀을 때
 * - 다른 유저가 내 게시물에 댓글을 달았을 때
 * - 다른 유저가 내가 운영하는 그룹에 참여했을 때
 * 등, "내가 수신자(receiver)인 이벤트" 입니다.
 *
 * 데이터 출처:
 * - activity_logs 테이블의 receiver_id = 나(현재 로그인한 유저) 인 행
 * - 발신자(user_id) 정보는 profiles 테이블에서 함께 가져옵니다.
 */
import { supabase } from '../lib/supabase';

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────

/**
 * 알림 한 건의 구조입니다.
 *
 * sender: 알림을 발생시킨 사람 (좋아요를 누른 사람, 댓글을 단 사람 등)
 * action: 어떤 행동을 했는지 ('like' | 'comment' | 'join_group' 등)
 * target_type: 행동의 대상이 무엇인지 ('post' | 'media' | 'group' | 'comment')
 * target_id: 대상의 UUID (예: 좋아요 받은 게시물 id)
 */
export type NotificationItem = {
  id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  created_at: string;
  // 알림을 보낸 사람의 프로필 정보 (profiles 테이블 join)
  sender: {
    id: string;
    nickname: string;
    avatar_url: string | null;
  } | null;
};

// ─────────────────────────────────────────────
// 공개 함수
// ─────────────────────────────────────────────

/**
 * 내가 받은 알림 목록을 최신순으로 가져옵니다.
 *
 * 사용 예:
 *   const { data, error } = await fetchMyNotifications(userId);
 *   if (error) { ... }           // 조회 실패 처리
 *   if (!data || data.length === 0) { ... } // 알림 없음 처리
 *
 * 동작 흐름:
 * 1. activity_logs 테이블에서 receiver_id = userId 인 행을 조회합니다.
 * 2. 각 행에서 user_id(발신자)의 profiles 정보를 함께 가져옵니다.
 *    → Supabase에서 외래키(FK) 관계를 이용해 join처럼 동작시킵니다.
 * 3. 최신 알림이 위에 오도록 created_at 내림차순으로 정렬합니다.
 * 4. 너무 많은 알림이 한 번에 오지 않도록 최대 50건만 가져옵니다.
 *
 * RLS 정책:
 * - activity_logs의 SELECT 정책이 "auth.uid() = receiver_id" 조건을 포함하므로
 *   본인 알림만 조회됩니다. 다른 사람 알림은 자동으로 차단됩니다.
 *
 * @param userId - 현재 로그인한 유저의 UUID
 */
export async function fetchMyNotifications(userId: string) {
  const { data, error } = await supabase
    .from('activity_logs')
    // receiver_id가 나인 행을 조회하면서
    // user_id(발신자)의 profiles 정보도 함께 선택합니다.
    // "sender:profiles!activity_logs_user_id_fkey" 는
    // activity_logs.user_id → profiles.id 외래키를 따라가서
    // 결과를 "sender" 라는 이름으로 붙이는 Supabase 문법입니다.
    .select(`
      id,
      action,
      target_type,
      target_id,
      created_at,
      sender:profiles!activity_logs_user_id_fkey (
        id,
        nickname,
        avatar_url
      )
    `)
    // 나(receiver_id)에게 온 알림만 필터링합니다.
    .eq('receiver_id', userId)
    // 최신 알림이 먼저 나오도록 내림차순 정렬합니다.
    .order('created_at', { ascending: false })
    // 한 번에 최대 50건만 가져와서 성능 부담을 줄입니다.
    .limit(50);

  // 타입을 명시적으로 변환합니다.
  // Supabase join 결과는 타입 추론이 복잡해서 직접 캐스팅하는 편이 안전합니다.
  return { data: data as NotificationItem[] | null, error };
}

/**
 * 특정 알림 한 건을 id로 조회합니다.
 *
 * 언제 쓰나?
 * - 알림을 눌렀을 때 해당 알림의 상세 정보(어떤 게시물인지 등)를 확인할 때 씁니다.
 *
 * @param notificationId - 조회할 알림의 UUID
 */
export async function fetchNotificationById(notificationId: string) {
  return supabase
    .from('activity_logs')
    .select(`
      id,
      action,
      target_type,
      target_id,
      created_at,
      sender:profiles!activity_logs_user_id_fkey (
        id,
        nickname,
        avatar_url
      )
    `)
    .eq('id', notificationId)
    .maybeSingle<NotificationItem>();
}

/**
 * 알림을 생성합니다 (다른 유저에게 알림 보내기).
 *
 * 언제 쓰나?
 * - 좋아요 버튼을 눌렀을 때: 게시물 작성자에게 알림을 만들어줍니다.
 * - 댓글을 달았을 때: 게시물 작성자에게 알림을 만들어줍니다.
 * - 그룹에 참여했을 때: 그룹 owner에게 알림을 만들어줍니다.
 *
 * 사용 예:
 *   await createNotification({
 *     userId: 내UUID,          // 행동한 사람 (나)
 *     receiverId: 상대UUID,   // 알림 받을 사람
 *     action: 'like',
 *     targetType: 'post',
 *     targetId: 게시물UUID,
 *   });
 *
 * RLS 정책:
 * - INSERT 정책이 "auth.uid() = user_id" 이므로
 *   반드시 userId에 현재 로그인한 내 UUID를 넣어야 합니다.
 *
 * @param params.userId     - 행동한 사람(나)의 UUID
 * @param params.receiverId - 알림 받을 사람의 UUID
 * @param params.action     - 행동 종류 ('like' | 'comment' | 'join_group' 등)
 * @param params.targetType - 대상 유형 ('post' | 'media' | 'group' | 'comment')
 * @param params.targetId   - 대상의 UUID
 */
export async function createNotification(params: {
  userId: string;
  receiverId: string;
  action: string;
  targetType?: string;
  targetId?: string;
}) {
  return supabase
    .from('activity_logs')
    .insert({
      user_id: params.userId,         // 행동한 사람 (나)
      receiver_id: params.receiverId, // 알림 받을 사람
      action: params.action,
      target_type: params.targetType ?? null,
      target_id: params.targetId ?? null,
    });
}
