/**
 * 역할: 회원 로그인과 게스트 체험 진입을 분리해 초반 진입 장벽을 낮추는 화면입니다.
 */
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/AppScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../constants/colors';

export function LoginScreen() {
  return (
    <AppScreen
      header={
        <ScreenHeader
          eyebrow="Login / Guest"
          title="먼저 편하게 둘러보고, 준비되면 진짜 계정을 연결하세요"
          description="지금은 UI와 구조를 먼저 만드는 단계이므로 입력값은 실제 인증 없이 흐름만 보여줍니다."
        />
      }
    >
      <SectionCard title="로그인 스켈레톤" description="나중에 Supabase Auth 또는 Firebase Auth로 연결될 자리입니다.">
        <View style={styles.field}>
          <Text style={styles.label}>이메일</Text>
          <Text style={styles.input}>hello@example.com</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>비밀번호</Text>
          <Text style={styles.input}>8자 이상 비밀번호</Text>
        </View>
        <PrimaryButton label="로그인 후 홈으로 이동" onPress={() => router.replace('/(tabs)')} />
      </SectionCard>

      <SectionCard title="게스트 진입" description="서비스 체험을 먼저 보여주고 나중에 회원가입을 유도할 수 있습니다.">
        <PrimaryButton label="게스트로 둘러보기" variant="secondary" onPress={() => router.replace('/(tabs)')} />
        <PrimaryButton label="그룹 만들기부터 시작" variant="ghost" onPress={() => router.push('/groups/create')} />
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.textMuted,
    fontSize: 14,
  },
});
