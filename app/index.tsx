/**
 * 역할: 앱 첫 진입 시 온보딩 화면으로 보내는 시작 라우트입니다.
 */
import { Redirect } from 'expo-router';

export default function IndexScreen() {
  return <Redirect href="/onboarding" />;
}
