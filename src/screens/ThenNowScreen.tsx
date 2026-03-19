/**
 * 역할: 과거와 현재의 같은 관계, 장소, 시간을 나란히 비교하는 화면입니다.
 */
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/AppScreen';
import { InfoChip } from '../components/InfoChip';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../constants/colors';
import { useAppData } from '../context/AppDataProvider';

export function ThenNowScreen() {
  const { thenNowComparisons } = useAppData();

  return (
    <AppScreen
      header={
        <ScreenHeader
          eyebrow="Then & Now"
          title="같은 사람, 같은 장소, 다른 시간"
          description="서비스의 차별점인 비교형 회상을 강조하는 화면으로, 추억의 변화가 한눈에 보이도록 설계했습니다."
        />
      }
    >
      {thenNowComparisons.map((comparison) => (
        <SectionCard key={comparison.id} title={comparison.title} description={comparison.story}>
          <View style={styles.compareRow}>
            <View style={styles.compareBox}>
              <InfoChip label="THEN" tone="accent" />
              <Text style={styles.compareLabel}>{comparison.thenLabel}</Text>
            </View>
            <View style={styles.compareBox}>
              <InfoChip label="NOW" tone="primary" />
              <Text style={styles.compareLabel}>{comparison.nowLabel}</Text>
            </View>
          </View>
        </SectionCard>
      ))}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  compareRow: {
    flexDirection: 'row',
    gap: 12,
  },
  compareBox: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    padding: 16,
    gap: 10,
    minHeight: 120,
  },
  compareLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
});
