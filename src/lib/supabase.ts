/**
 * 역할:
 * 이 파일은 "Supabase 서버와 연결되는 공용 client"를 만드는 파일입니다.
 *
 * 왜 필요한가?
 * 화면마다 직접 Supabase URL, anon key, createClient 코드를 쓰기 시작하면
 * 중복이 많아지고, 나중에 설정을 바꿀 때 모든 파일을 고쳐야 합니다.
 *
 * 그래서 이 프로젝트에서는:
 * 1. Supabase 연결 설정은 이 파일 한 곳에서만 만들고
 * 2. 다른 파일(authService, profileService, provider 등)은
 *    여기서 만든 `supabase` 객체만 가져다 쓰도록 구성했습니다.
 *
 * 이렇게 하면 좋은 점:
 * - 설정이 한 곳에 모여 있어서 관리가 쉽고
 * - 초보자도 "Supabase 연결은 여기서 시작되는구나"를 바로 이해할 수 있고
 * - 나중에 옵션을 추가해도 수정 지점이 명확합니다.
 */
import { createClient } from '@supabase/supabase-js';

/**
 * Expo에서는 브라우저/모바일에서 접근 가능한 공개 환경변수에
 * `EXPO_PUBLIC_` 접두사를 붙여서 사용합니다.
 *
 * 여기서는 .env 파일에 넣어둔 값을 읽어옵니다.
 * 예:
 * EXPO_PUBLIC_SUPABASE_URL=...
 * EXPO_PUBLIC_SUPABASE_ANON_KEY=...
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/**
 * 환경변수가 빠진 상태로 앱을 실행하면
 * 나중에 더 복잡한 위치에서 오류가 나는 것보다
 * "연결 정보가 없다"는 사실을 여기서 바로 알려주는 편이 훨씬 이해하기 쉽습니다.
 *
 * 그래서 client를 만들기 전에 먼저 체크합니다.
 */
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing. Check the .env file.');
}

/**
 * createClient는 Supabase와 통신할 때 사용할 핵심 객체를 만듭니다.
 *
 * 앞으로 다른 파일에서는 아래처럼 사용합니다.
 * - supabase.auth.signInWithPassword(...)
 * - supabase.from('profiles').select(...)
 *
 * 즉, 이 한 줄이 "앱에서 Supabase를 쓰기 위한 출발점"입니다.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
