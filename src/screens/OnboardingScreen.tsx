/**
 * 역할: 서비스의 감정적 가치와 핵심 흐름을 첫 화면에서 전달하고 로그인 화면으로 자연스럽게 이동시킵니다.
 */
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/AppScreen';
import { InfoChip } from '../components/InfoChip';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../constants/colors';
import { useAppData } from '../context/AppDataProvider';

export function OnboardingScreen() {
  const { onboardingSlides } = useAppData();

  return (
    <AppScreen
      header={
        <ScreenHeader
          eyebrow="Private Group SNS"
          title="우리만의 공간에서, 추억은 더 오래 남습니다"
          description="사진을 저장하는 앱이 아니라 함께 기억하고 다시 회상하는 경험을 설계했습니다."
        />
      }
    >
      <SectionCard
        title="첫 인상 스토리"
        description="사용자가 앱의 의미를 이해하고 그룹 생성 또는 참여로 이어지도록 감정선 중심으로 구성했습니다."
      >
        {onboardingSlides.map((slide) => (
          <View key={slide.id} style={styles.storyCard}>
            <InfoChip label={slide.eyebrow} tone="primary" />
            <Text style={styles.storyTitle}>{slide.title}</Text>
            <Text style={styles.storyDescription}>{slide.description}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard title="처음 시작하는 흐름" description="온보딩 이후 사용자가 헤매지 않도록 다음 행동을 바로 보여줍니다.">
        <View style={styles.flowRow}>
          <InfoChip label="1. 서비스 이해" tone="accent" />
          <InfoChip label="2. 로그인 또는 게스트" />
          <InfoChip label="3. 그룹 생성/참여" tone="primary" />
        </View>
        <PrimaryButton label="온보딩을 마치고 입장하기" onPress={() => router.push('/login')} />
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  storyCard: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    gap: 10,
  },
  storyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 28,
  },
  storyDescription: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  flowRow: {
    gap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
