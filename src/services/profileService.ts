/**
 * 역할: profiles 테이블 조회 / 생성 / 수정을 담당하는 파일입니다.
 *
 * 이 파일에서 할 수 있는 것:
 * 1. fetchProfile  — 특정 유저의 프로필 읽기
 * 2. ensureProfile — 프로필이 없으면 기본값으로 생성, 있으면 그대로 반환
 * 3. updateProfile — 닉네임 / 소개 / 아바타 URL 수정
 */
import { supabase } from '../lib/supabase';

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────

/**
 * Supabase profiles 테이블 한 행의 구조입니다.
 * 화면에서 프로필 데이터를 받을 때 이 타입을 기준으로 씁니다.
 */
export type ProfileRow = {
  id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  role_label: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * ensureProfile 함수에 넘기는 입력 타입입니다.
 * - id: 반드시 필요 (auth.users의 UUID)
 * - email / fullName: 닉네임 기본값 생성에 활용
 */
type EnsureProfileInput = {
  id: string;
  email?: string | null;
  fullName?: string | null;
};

/**
 * updateProfile 함수에 넘기는 수정 가능한 필드 타입입니다.
 * - 세 가지 중 수정하고 싶은 필드만 선택해서 보내면 됩니다.
 */
export type UpdateProfileInput = {
  nickname?: string;
  bio?: string;
  avatar_url?: string | null;
};

// ─────────────────────────────────────────────
// 내부 헬퍼 함수
// ─────────────────────────────────────────────

/**
 * 처음 프로필을 만들 때 사용할 기본 닉네임을 정합니다.
 * 우선순위: fullName → 이메일 앞부분 → "user_UUID앞4자리"
 */
function makeDefaultNickname(input: EnsureProfileInput) {
  if (input.fullName?.trim()) {
    return input.fullName.trim();
  }
  if (input.email) {
    return input.email.split('@')[0];
  }
  return `user_${input.id.slice(0, 4)}`;
}

// ─────────────────────────────────────────────
// 공개 함수
// ─────────────────────────────────────────────

/**
 * 특정 유저의 프로필을 Supabase에서 읽어옵니다.
 *
 * 사용 예:
 *   const { data, error } = await fetchProfile(userId);
 *   if (error) { ... }  // 조회 실패 처리
 *   if (!data) { ... } // 프로필 없음 처리
 *
 * maybeSingle(): 결과가 0건이면 null, 1건이면 data 객체를 반환합니다.
 * (single()은 0건일 때 error가 나서 maybeSingle()이 더 안전합니다.)
 */
export async function fetchProfile(userId: string) {
  return supabase
    .from('profiles')
    .select('id, nickname, avatar_url, bio, role_label, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle<ProfileRow>();
}

/**
 * 프로필이 없으면 기본값으로 생성하고, 있으면 기존 프로필을 반환합니다.
 *
 * 언제 쓰나?
 * - 회원가입 직후 또는 소셜 로그인 이후에
 *   "혹시 프로필이 없으면 만들어줘" 하는 상황에서 씁니다.
 *
 * upsert(): INSERT 시도 → 이미 있으면(id 충돌) UPDATE 로 자동 전환합니다.
 * onConflict: 'id' → id가 같은 행이 있을 때를 충돌로 판단합니다.
 */
export async function ensureProfile(input: EnsureProfileInput) {
  return supabase
    .from('profiles')
    .upsert(
      {
        id: input.id,
        nickname: makeDefaultNickname(input),
        role_label: '멤버',
      },
      { onConflict: 'id' }
    )
    .select('id, nickname, avatar_url, bio, role_label, created_at, updated_at')
    .single<ProfileRow>();
}

/**
 * 내 프로필 정보를 수정합니다.
 *
 * 수정 가능한 필드: nickname(닉네임), bio(소개글), avatar_url(프로필 이미지 URL)
 *
 * 사용 예:
 *   const { data, error } = await updateProfile(userId, {
 *     nickname: '새닉네임',
 *     bio: '안녕하세요!',
 *   });
 *
 * 동작 흐름:
 * 1. profiles 테이블에서 id = userId 인 행을 찾아
 * 2. 넘긴 fields만 업데이트합니다.
 * 3. 변경된 전체 프로필 행을 반환합니다.
 *
 * RLS 정책에 의해 본인(auth.uid() = id)만 수정할 수 있습니다.
 */
export async function updateProfile(userId: string, fields: UpdateProfileInput) {
  return supabase
    .from('profiles')
    .update({
      // 넘어온 필드만 반영합니다. 안 넘긴 필드는 기존 값이 유지됩니다.
      ...fields,
      // 수정 시각을 현재 시각으로 갱신합니다.
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)          // 본인 행만 대상으로 합니다.
    .select('id, nickname, avatar_url, bio, role_label, created_at, updated_at')
    .single<ProfileRow>();
}
