import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '../src/constants/colors';
import { AppDataProvider } from '../src/context/AppDataProvider';

export default function RootLayout() {
  return (
    <AppDataProvider>
      <StatusBar style="light" />
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
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="post/[postId]" />
      </Stack>
    </AppDataProvider>
  );
}
