/**
 * 역할:
 * 이 파일은 "인증 관련 Supabase 호출"만 모아두는 서비스 파일입니다.
 *
 * 왜 분리했나?
 * 로그인 화면이나 회원가입 화면에서
 * 바로 `supabase.auth...`를 직접 쓰기 시작하면
 * 화면(UI) 코드와 데이터 호출 코드가 한 파일에 섞이게 됩니다.
 *
 * 이 프로젝트에서는 초보자도 흐름을 이해하기 쉽게
 * 아래처럼 역할을 나눴습니다.
 * - screen: 버튼 클릭, 입력값 관리, 에러 표시
 * - service: Supabase에 실제 요청 보내기
 *
 * 이렇게 분리하면:
 * - 화면 코드는 "무슨 행동을 할지"만 읽으면 되고
 * - service 코드는 "어떤 요청을 보내는지"만 읽으면 됩니다.
 */
import { supabase } from '../lib/supabase';

/**
 * 로그인 함수
 *
 * 무엇을 하나?
 * - 이메일과 비밀번호를 받아서 Supabase Auth 로그인 요청을 보냅니다.
 *
 * 왜 이렇게 단순하게 만들었나?
 * - 화면에서 입력 검증은 screen 쪽에서 처리하고
 * - 이 함수는 "Supabase 로그인 요청" 하나만 담당하게 하려는 의도입니다.
 *
 * 반환값:
 * - Supabase가 주는 data / error 구조를 그대로 반환합니다.
 * - 화면에서는 그 결과를 보고 성공이면 이동, 실패면 Alert를 띄웁니다.
 */
export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

/**
 * 회원가입 함수
 *
 * 무엇을 하나?
 * - 이메일, 비밀번호로 회원가입을 만들고
 * - `full_name`을 user metadata에 함께 저장합니다.
 *
 * 왜 full_name을 metadata에 넣나?
 * - auth.users 기본 정보만으로는 화면에서 이름을 바로 쓰기 어려울 수 있습니다.
 * - 그래서 회원가입 시점에 이름을 metadata에도 남겨두면
 *   이후 profiles 테이블을 만들거나 fallback 이름을 정할 때 도움이 됩니다.
 *
 * 참고:
 * - 실제 앱에서는 이 함수가 성공한 뒤
 *   profiles 테이블에도 별도 upsert를 한 번 더 해줍니다.
 */
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

/**
 * 회원가입 이메일 OTP 인증 함수
 *
 * 무엇을 하나?
 * - 이메일로 받은 6자리 인증 코드를 Supabase에 보내서
 *   회원가입 인증을 완료합니다.
 *
 * 왜 분리했나?
 * - 회원가입 화면은 "가입" 단계와 "인증" 단계를 둘 다 갖고 있어서
 *   이 로직을 화면 안에 직접 넣기보다 함수로 분리하는 편이 읽기 쉽습니다.
 */
export async function verifySignupOtp(email: string, token: string) {
  return supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  });
}

/**
 * 인증 코드 재전송 함수
 *
 * 무엇을 하나?
 * - 회원가입 이메일 인증 코드를 다시 보내달라고 Supabase에 요청합니다.
 *
 * 언제 쓰나?
 * - 사용자가 메일을 못 받았거나
 * - 인증 코드를 다시 발급받고 싶을 때 사용합니다.
 */
export async function resendSignupOtp(email: string) {
  return supabase.auth.resend({
    type: 'signup',
    email,
  });
}

/**
 * 로그아웃 함수
 *
 * 무엇을 하나?
 * - 현재 로그인된 Supabase 세션을 종료합니다.
 *
 * 왜 provider가 아니라 여기에도 두나?
 * - provider는 "앱 상태 관리"
 * - service는 "실제 Supabase 호출"
 * 로 역할을 나누고 있기 때문입니다.
 *
 * 즉:
 * - 이 함수는 서버/세션 종료 요청
 * - provider는 로그인 상태 false로 갱신
 */
export async function signOutFromSupabase() {
  return supabase.auth.signOut();
}
