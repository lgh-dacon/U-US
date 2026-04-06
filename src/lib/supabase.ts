/**
 * 역할: Supabase 프로젝트와 연결되는 공용 client 파일입니다.
 * 환경변수 이름은 Expo Web과 모바일 모두에서 읽기 쉬운 EXPO_PUBLIC_* 형태를 사용합니다.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing. Check the .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
