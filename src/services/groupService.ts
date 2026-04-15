/**
 * 역할: 그룹(행성) 관련 Supabase 호출을 담당하는 파일입니다.
 *
 * 이 파일에서 할 수 있는 것:
 * 1. createGroup       — 새 그룹 생성 + 생성자 자동으로 owner로 추가
 * 2. fetchMyGroups     — 내가 속한 그룹 목록 조회
 * 3. fetchGroupById    — 그룹 단건 상세 조회
 * 4. generateInviteCode — 초대 코드 발급
 * 5. joinGroupByCode   — 초대 코드로 그룹 참여
 * 6. fetchGroupMembers — 그룹 멤버 목록 조회
 * 7. leaveGroup        — 그룹 탈퇴
 *
 * 연동 테이블:
 * - groups        : 그룹 기본 정보
 * - group_members : 그룹 ↔ 유저 연결 (role 포함)
 * - invites       : 초대 코드
 */
import { supabase } from '../lib/supabase';

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────

/**
 * groups 테이블 한 행의 구조입니다.
 *
 * planet_color : 앱에서 그룹을 행성으로 표현할 때 사용하는 색상 hex 코드
 * planet_size  : 행성의 상대적 크기 (정수, UI에서 비율로 활용)
 */
export type GroupRow = {
  id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  planet_color: string;
  planet_size: number;
  created_by: string;
  created_at: string;
  updated_at: string;
};

/**
 * group_members 테이블 한 행의 구조입니다.
 *
 * role : 'owner' | 'admin' | 'member'
 *        - owner  : 그룹을 만든 사람, 삭제/모든 관리 권한
 *        - admin  : 멤버 추가/제거 권한
 *        - member : 일반 멤버
 */
export type GroupMemberRow = {
  id: string;
  group_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
};

/**
 * fetchGroupMembers 에서 프로필 정보를 join한 결과 타입입니다.
 * 멤버 목록 화면에서 닉네임 / 아바타 이미지를 바로 표시할 수 있습니다.
 */
export type GroupMemberWithProfile = GroupMemberRow & {
  profile: {
    nickname: string;
    avatar_url: string | null;
    role_label: string | null;
  } | null;
};

/**
 * invites 테이블 한 행의 구조입니다.
 *
 * invite_code : 사용자에게 공유하는 짧은 문자열 코드
 * expires_at  : 만료 시각 (null이면 무제한)
 * is_used     : 이미 사용된 코드인지 여부
 */
export type InviteRow = {
  id: string;
  group_id: string;
  invited_by: string;
  invite_code: string;
  expires_at: string | null;
  is_used: boolean;
  created_at: string;
};

/**
 * createGroup 함수에 넘기는 입력 타입입니다.
 * name만 필수이고 나머지는 선택 항목입니다.
 */
export type CreateGroupInput = {
  name: string;
  description?: string;
  cover_image_url?: string | null;
  planet_color?: string;
  planet_size?: number;
};

// ─────────────────────────────────────────────
// 내부 헬퍼 함수
// ─────────────────────────────────────────────

/**
 * 랜덤 초대 코드를 생성합니다.
 *
 * 어떻게 만드나?
 * - 영문 대문자 + 숫자 조합에서 8자리를 무작위로 뽑습니다.
 * - 예: "A3FX92KL"
 *
 * 왜 8자리인가?
 * - 너무 짧으면 충돌 가능성이 높고, 너무 길면 사용자가 입력하기 불편합니다.
 * - 36^8 ≈ 28억 가지 조합으로 실용적인 수준에서 충돌 가능성이 낮습니다.
 */
function makeInviteCode(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('');
}

// ─────────────────────────────────────────────
// 공개 함수
// ─────────────────────────────────────────────

/**
 * 1. 새 그룹을 생성합니다.
 *
 * 동작 흐름:
 * 1) groups 테이블에 새 행을 INSERT 합니다.
 * 2) 생성 성공 후, 만든 사람을 group_members에 'owner' 역할로 추가합니다.
 *    (두 번에 나눠서 실행 — Supabase 무료 플랜에서는 트랜잭션 RPC 없이 이렇게 처리합니다.)
 *
 * 왜 owner를 따로 추가하나?
 * - groups 테이블에는 created_by만 있고, 실제 멤버 목록은 group_members에 관리합니다.
 * - 만든 사람이 자동으로 멤버 목록에도 들어가야 그룹 조회가 정상 동작합니다.
 *   (groups RLS: group_members에 있는 사람만 조회 가능)
 *
 * 사용 예:
 *   const { group, error } = await createGroup(userId, {
 *     name: '우리 가족',
 *     description: '가족 사진 모음',
 *     planet_color: '#7B61FF',
 *   });
 *
 * @param userId - 그룹을 만드는 사람(현재 로그인한 유저)의 UUID
 * @param input  - 그룹 생성 정보
 */
export async function createGroup(
  userId: string,
  input: CreateGroupInput
): Promise<{ group: GroupRow | null; error: Error | null }> {
  // ① groups 테이블에 새 그룹 행 삽입
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .insert({
      name: input.name,
      description: input.description ?? '',
      cover_image_url: input.cover_image_url ?? null,
      planet_color: input.planet_color ?? '#7B61FF', // 기본 보라색
      planet_size: input.planet_size ?? 100,
      created_by: userId,
    })
    .select('id, name, description, cover_image_url, planet_color, planet_size, created_by, created_at, updated_at')
    .single<GroupRow>();

  // 그룹 생성 자체가 실패하면 바로 에러 반환
  if (groupError || !group) {
    return { group: null, error: groupError ?? new Error('그룹 생성에 실패했습니다.') };
  }

  // ② 만든 사람을 group_members에 owner로 추가
  const { error: memberError } = await supabase
    .from('group_members')
    .insert({
      group_id: group.id,
      user_id: userId,
      role: 'owner',
    });

  if (memberError) {
    // 멤버 추가 실패 시: 그룹은 만들어졌지만 멤버가 없는 상태가 됩니다.
    // 실제 서비스에서는 이 경우 그룹을 삭제(롤백)하는 처리를 추가해야 합니다.
    return { group: null, error: memberError };
  }

  return { group, error: null };
}

/**
 * 2. 내가 속한 그룹 목록을 가져옵니다.
 *
 * 동작 흐름:
 * 1) group_members 테이블에서 user_id = 나인 행들을 조회합니다.
 * 2) 각 행에서 group_id를 따라 groups 테이블의 데이터를 함께 가져옵니다.
 *    (Supabase FK join 문법 활용)
 * 3) 그룹 이름 오름차순으로 정렬합니다.
 *
 * RLS 정책:
 * - group_members SELECT: 같은 그룹에 속한 멤버만 조회 가능
 * - groups SELECT: group_members에 있는 사람만 조회 가능
 * → 내가 속하지 않은 그룹은 자동으로 제외됩니다.
 *
 * 사용 예:
 *   const { data, error } = await fetchMyGroups(userId);
 *
 * @param userId - 현재 로그인한 유저의 UUID
 */
export async function fetchMyGroups(userId: string) {
  const { data, error } = await supabase
    .from('group_members')
    .select(`
      role,
      joined_at,
      group:groups (
        id,
        name,
        description,
        cover_image_url,
        planet_color,
        planet_size,
        created_by,
        created_at,
        updated_at
      )
    `)
    // 내가 속한 그룹만 필터링합니다.
    .eq('user_id', userId)
    // 그룹 이름 기준으로 정렬합니다. (join된 컬럼은 dot 표기법 사용)
    .order('joined_at', { ascending: false });

  if (error) {
    return { data: null, error };
  }

  // Supabase join 결과를 화면에서 쓰기 편한 형태로 변환합니다.
  // group_members 행에서 group 정보만 추출하고, 내 role도 함께 붙입니다.
  const groups = data
    .map((row) => {
      const group = row.group as unknown as GroupRow | null;
      if (!group) return null;
      return {
        ...group,
        myRole: row.role as 'owner' | 'admin' | 'member',
        joinedAt: row.joined_at,
      };
    })
    .filter(Boolean);

  return { data: groups, error: null };
}

/**
 * 3. 그룹 단건 상세 정보를 가져옵니다.
 *
 * 언제 쓰나?
 * - 그룹 상세 화면에서 그룹 이름, 설명, 행성 색상 등을 표시할 때 씁니다.
 *
 * maybeSingle():
 * - 결과가 0건이면 data = null 반환 (에러 아님)
 * - 결과가 1건이면 data 객체 반환
 *
 * @param groupId - 조회할 그룹의 UUID
 */
export async function fetchGroupById(groupId: string) {
  return supabase
    .from('groups')
    .select('id, name, description, cover_image_url, planet_color, planet_size, created_by, created_at, updated_at')
    .eq('id', groupId)
    .maybeSingle<GroupRow>();
}

/**
 * 4. 초대 코드를 발급합니다.
 *
 * 동작 흐름:
 * 1) 8자리 랜덤 코드를 생성합니다.
 * 2) invites 테이블에 코드를 저장합니다.
 * 3) 만료 시각(기본 7일 후)을 함께 저장합니다.
 *
 * 코드 충돌 처리:
 * - 만에 하나 같은 코드가 이미 있으면 Supabase에서 unique 에러가 납니다.
 * - 실제 서비스에서는 재시도 로직을 추가하면 됩니다.
 *   지금은 간단하게 에러를 그대로 반환합니다.
 *
 * 사용 예:
 *   const { data, error } = await generateInviteCode(userId, groupId);
 *   // data.invite_code → 사용자에게 공유할 코드 문자열
 *
 * @param userId  - 초대 코드를 만드는 사람(현재 로그인한 유저)의 UUID
 * @param groupId - 초대할 그룹의 UUID
 * @param expiresInDays - 만료까지 남은 일수 (기본값 7일, null이면 무제한)
 */
export async function generateInviteCode(
  userId: string,
  groupId: string,
  expiresInDays: number | null = 7
) {
  // 만료 시각 계산 (null이면 무제한)
  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : null;

  return supabase
    .from('invites')
    .insert({
      group_id: groupId,
      invited_by: userId,
      invite_code: makeInviteCode(),  // 8자리 랜덤 코드 생성
      expires_at: expiresAt,
      is_used: false,
    })
    .select('id, group_id, invited_by, invite_code, expires_at, is_used, created_at')
    .single<InviteRow>();
}

/**
 * 5. 초대 코드로 그룹에 참여합니다.
 *
 * 동작 흐름:
 * 1) invites 테이블에서 해당 코드를 조회합니다.
 * 2) 코드 유효성을 검사합니다.
 *    - 존재하는 코드인가?
 *    - 이미 사용된 코드인가?
 *    - 만료된 코드인가?
 * 3) 이미 그룹 멤버인지 확인합니다. (중복 참여 방지)
 * 4) group_members에 새 멤버로 추가합니다.
 * 5) invites의 is_used를 true로 업데이트합니다.
 *
 * 반환값:
 * - success: true/false
 * - groupId: 참여한 그룹 ID (성공 시)
 * - error: 실패 원인 메시지
 *
 * 사용 예:
 *   const result = await joinGroupByCode(userId, 'A3FX92KL');
 *   if (!result.success) Alert.alert('참여 실패', result.error);
 *
 * @param userId     - 참여하는 사람(현재 로그인한 유저)의 UUID
 * @param inviteCode - 사용자가 입력한 초대 코드 문자열
 */
export async function joinGroupByCode(
  userId: string,
  inviteCode: string
): Promise<{ success: boolean; groupId?: string; error?: string }> {
  // ① 초대 코드 조회 (대소문자 무시: ilike 사용)
  const { data: invite, error: fetchError } = await supabase
    .from('invites')
    .select('id, group_id, is_used, expires_at')
    .ilike('invite_code', inviteCode.trim()) // 앞뒤 공백 제거 후 대소문자 무시 검색
    .maybeSingle();

  if (fetchError) {
    return { success: false, error: '초대 코드 확인 중 오류가 발생했습니다.' };
  }

  // ② 코드 존재 여부 확인
  if (!invite) {
    return { success: false, error: '존재하지 않는 초대 코드입니다.' };
  }

  // ③ 이미 사용된 코드 확인
  if (invite.is_used) {
    return { success: false, error: '이미 사용된 초대 코드입니다.' };
  }

  // ④ 만료 여부 확인
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return { success: false, error: '만료된 초대 코드입니다.' };
  }

  // ⑤ 이미 그룹 멤버인지 확인 (중복 참여 방지)
  const { data: existingMember } = await supabase
    .from('group_members')
    .select('id')
    .eq('group_id', invite.group_id)
    .eq('user_id', userId)
    .maybeSingle();

  if (existingMember) {
    return { success: false, error: '이미 참여 중인 그룹입니다.' };
  }

  // ⑥ group_members에 새 멤버 추가 (기본 role: 'member')
  const { error: joinError } = await supabase
    .from('group_members')
    .insert({
      group_id: invite.group_id,
      user_id: userId,
      role: 'member',
    });

  if (joinError) {
    return { success: false, error: '그룹 참여 중 오류가 발생했습니다.' };
  }

  // ⑦ 초대 코드를 사용됨으로 표시
  await supabase
    .from('invites')
    .update({ is_used: true })
    .eq('id', invite.id);

  return { success: true, groupId: invite.group_id };
}

/**
 * 6. 그룹 멤버 목록을 조회합니다.
 *
 * 동작 흐름:
 * 1) group_members 테이블에서 group_id 기준으로 멤버를 조회합니다.
 * 2) 각 멤버의 profiles 정보(닉네임, 아바타, 역할 라벨)를 join합니다.
 * 3) owner → admin → member 순으로 정렬합니다.
 *
 * 사용 예:
 *   const { data, error } = await fetchGroupMembers(groupId);
 *   // data: [{ user_id, role, profile: { nickname, avatar_url } }, ...]
 *
 * @param groupId - 멤버를 조회할 그룹의 UUID
 */
export async function fetchGroupMembers(groupId: string) {
  const { data, error } = await supabase
    .from('group_members')
    .select(`
      id,
      group_id,
      user_id,
      role,
      joined_at,
      profile:profiles (
        nickname,
        avatar_url,
        role_label
      )
    `)
    // 해당 그룹의 멤버만 필터링합니다.
    .eq('group_id', groupId)
    // 참여 순서대로 정렬합니다.
    .order('joined_at', { ascending: true });

  if (error) {
    return { data: null, error };
  }

  // role 우선순위 정렬: owner → admin → member
  const roleOrder: Record<string, number> = { owner: 0, admin: 1, member: 2 };
  const sorted = (data ?? []).sort(
    (a, b) =>
      (roleOrder[a.role] ?? 99) - (roleOrder[b.role] ?? 99)
  );

  return { data: sorted as unknown as GroupMemberWithProfile[], error: null };
}

/**
 * 7. 그룹에서 탈퇴합니다.
 *
 * 주의사항:
 * - owner는 탈퇴할 수 없습니다.
 *   그룹을 없애려면 별도 deleteGroup 기능이 필요합니다.
 *   (지금은 owner 탈퇴 시도 시 에러를 반환합니다.)
 * - 탈퇴 후에는 해당 그룹의 데이터(게시물, 미디어 등)를 볼 수 없게 됩니다.
 *   (RLS 정책이 group_members 기준으로 동작하기 때문)
 *
 * 동작 흐름:
 * 1) 현재 내 role을 먼저 조회합니다.
 * 2) owner면 탈퇴를 막습니다.
 * 3) group_members에서 내 행을 DELETE 합니다.
 *
 * 사용 예:
 *   const result = await leaveGroup(userId, groupId);
 *   if (!result.success) Alert.alert('탈퇴 실패', result.error);
 *
 * @param userId  - 탈퇴하는 사람(현재 로그인한 유저)의 UUID
 * @param groupId - 탈퇴할 그룹의 UUID
 */
export async function leaveGroup(
  userId: string,
  groupId: string
): Promise<{ success: boolean; error?: string }> {
  // ① 내 현재 role 조회
  const { data: myMembership, error: fetchError } = await supabase
    .from('group_members')
    .select('id, role')
    .eq('group_id', groupId)
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) {
    return { success: false, error: '멤버 정보 확인 중 오류가 발생했습니다.' };
  }

  if (!myMembership) {
    return { success: false, error: '해당 그룹의 멤버가 아닙니다.' };
  }

  // ② owner는 탈퇴 불가 (그룹 운영 책임자이므로)
  if (myMembership.role === 'owner') {
    return {
      success: false,
      error: 'owner는 그룹을 탈퇴할 수 없습니다. 다른 멤버에게 owner를 양도한 뒤 탈퇴해 주세요.',
    };
  }

  // ③ group_members에서 내 행 삭제
  const { error: deleteError } = await supabase
    .from('group_members')
    .delete()
    .eq('id', myMembership.id); // id 기준으로 삭제해서 다른 멤버에게 영향 없도록 합니다.

  if (deleteError) {
    return { success: false, error: '그룹 탈퇴 중 오류가 발생했습니다.' };
  }

  return { success: true };
}
