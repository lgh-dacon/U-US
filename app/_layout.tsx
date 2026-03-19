/**
 * 역할: 앱 전체 Stack 네비게이션과 전역 데이터 공급자를 연결하는 최상위 진입 파일입니다.
 */
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '../src/constants/colors';
import { AppDataProvider } from '../src/context/AppDataProvider';

export default function RootLayout() {
  return (
    <AppDataProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="groups/create" />
        <Stack.Screen name="groups/join" />
        <Stack.Screen name="groups/[groupId]/index" />
        <Stack.Screen name="groups/[groupId]/feed" />
        <Stack.Screen name="groups/[groupId]/map" />
        <Stack.Screen name="groups/[groupId]/calendar" />
        <Stack.Screen name="upload" />
        <Stack.Screen name="posts/[postId]" />
        <Stack.Screen name="memories/recap" />
        <Stack.Screen name="memories/then-now" />
      </Stack>
    </AppDataProvider>
  );
}
