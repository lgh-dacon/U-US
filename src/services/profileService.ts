/**
 * 역할: profiles 테이블 조회와 upsert를 담당하는 파일입니다.
 */
import { supabase } from '../lib/supabase';

export type ProfileRow = {
  id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  role_label: string | null;
  created_at: string;
  updated_at: string;
};

type EnsureProfileInput = {
  id: string;
  email?: string | null;
  fullName?: string | null;
};

function makeDefaultNickname(input: EnsureProfileInput) {
  if (input.fullName?.trim()) {
    return input.fullName.trim();
  }

  if (input.email) {
    return input.email.split('@')[0];
  }

  return `user_${input.id.slice(0, 4)}`;
}

export async function fetchProfile(userId: string) {
  return supabase
    .from('profiles')
    .select('id, nickname, avatar_url, bio, role_label, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle<ProfileRow>();
}

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
