/**
 * 역할: 그룹 추억을 위치 중심으로 다시 살펴보는 지도형 조회 스켈레톤 화면입니다.
 */
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/AppScreen';
import { InfoChip } from '../components/InfoChip';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../constants/colors';
import { useAppData } from '../context/AppDataProvider';

type MapViewScreenProps = {
  groupId: string;
};

export function MapViewScreen({ groupId }: MapViewScreenProps) {
  const { groups, posts } = useAppData();
  const group = groups.find((item) => item.id === groupId) ?? groups[0];
  const locations = posts.filter((post) => post.groupId === group.id);

  return (
    <AppScreen
      header={
        <ScreenHeader
          eyebrow="Map View"
          title={`${group.name}의 장소 기억`}
          description="나중에 실제 지도를 붙이면 게시글 위치 데이터를 기반으로 핀과 클러스터를 배치할 수 있습니다."
        />
      }
    >
      <SectionCard title="지도 Placeholder" description="react-native-maps 또는 웹뷰 지도 연결 전에 UI 배치를 먼저 잡습니다.">
        <View style={styles.mapArea}>
          <Text style={styles.mapTitle}>Map Preview Area</Text>
          <Text style={styles.mapText}>추억 위치 핀, 경로, 핫스팟 카드가 들어갈 자리</Text>
        </View>
      </SectionCard>

      <SectionCard title="위치 기반 추억" description="게시글과 연결된 장소 이름이 들어오면 이 리스트와 지도 핀을 연결할 수 있습니다.">
        {locations.map((post) => (
          <View key={post.id} style={styles.locationRow}>
            <Text style={styles.locationTitle}>{post.locationName}</Text>
            <InfoChip label={post.title} tone="accent" />
          </View>
        ))}
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  mapArea: {
    height: 240,
    borderRadius: 24,
    backgroundColor: colors.backgroundStrong,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  mapTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  mapText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  locationRow: {
    gap: 8,
  },
  locationTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
});
