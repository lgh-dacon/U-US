/**
 * 역할: Supabase Auth를 사용하는 로그인, 회원가입, OTP 인증 함수를 모아둔 파일입니다.
 */
import { supabase } from '../lib/supabase';

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
}

export async function verifySignupOtp(email: string, token: string) {
  return supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  });
}

export async function resendSignupOtp(email: string) {
  return supabase.auth.resend({
    type: 'signup',
    email,
  });
}

export async function signOutFromSupabase() {
  return supabase.auth.signOut();
}
