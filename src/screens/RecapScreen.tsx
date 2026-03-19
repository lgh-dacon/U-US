/**
 * 역할: 주간/월간 추억 회고를 카드형으로 보여주는 화면입니다.
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

export function RecapScreen() {
  const { recaps } = useAppData();

  return (
    <AppScreen
      header={
        <ScreenHeader
          eyebrow="Memory Recap"
          title="시간이 쌓인 만큼, 감정도 다시 읽어봅니다"
          description="주간과 월간 회고는 단순 요약이 아니라 추억의 분위기와 반응을 함께 보여주도록 설계했습니다."
        />
      }
    >
      <SectionCard title="기간 선택" description="나중에 탭 상태와 필터를 붙이면 주간/월간 전환이 가능합니다.">
        <View style={styles.row}>
          <InfoChip label="주간 회고" tone="primary" />
          <InfoChip label="월간 회고" tone="accent" />
        </View>
      </SectionCard>

      {recaps.map((recap) => (
        <SectionCard key={recap.id} title={recap.title} description={recap.summary}>
          <Text style={styles.highlight}>{recap.highlight}</Text>
          <InfoChip label={`감정 키워드: ${recap.emotionKeyword}`} tone="primary" />
        </SectionCard>
      ))}

      <PrimaryButton
        label="Then & Now 비교 보러가기"
        variant="secondary"
        onPress={() => router.push('/memories/then-now')}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  highlight: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
});
