/**
 * 역할: 앱 첫 진입 시 로그인 상태를 보고 온보딩 또는 메인 탭으로 보내는 시작 라우트입니다.
 */
import { Redirect } from 'expo-router';

import { useAppData } from '../src/context/AppDataProvider';

export default function IndexScreen() {
  const { isLoggedIn, isAuthLoading } = useAppData();

  if (isAuthLoading) {
    return null;
  }

  if (isLoggedIn) {
    return <Redirect href="/(tabs)/planet" />;
  }

  return <Redirect href="/onboarding" />;
}
