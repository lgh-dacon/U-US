/**
 * 역할: 내가 속한 그룹 목록과 빠른 액션을 보여주는 메인 홈 화면입니다.
 */
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/AppScreen';
import { InfoChip } from '../components/InfoChip';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../constants/colors';
import { useAppData } from '../context/AppDataProvider';
import { formatCountLabel } from '../utils/format';

export function HomeScreen() {
  const { currentUser, groups, recaps } = useAppData();

  return (
    <AppScreen
      header={
        <ScreenHeader
          eyebrow={`안녕하세요, ${currentUser.name}`}
          title="오늘도 우리 추억방에 새로운 장면이 쌓이고 있어요"
          description="홈에서는 내가 속한 그룹과 최근 회고 흐름을 가장 먼저 확인할 수 있습니다."
        />
      }
    >
      <SectionCard title="빠른 시작" description="초보자도 앱 구조를 이해하기 쉽게 주요 진입을 바로 배치했습니다.">
        <PrimaryButton label="새 그룹 만들기" onPress={() => router.push('/groups/create')} />
        <PrimaryButton label="초대 코드로 참여하기" variant="secondary" onPress={() => router.push('/groups/join')} />
      </SectionCard>

      <SectionCard title="내 그룹" description="그룹을 누르면 상세, 피드, 지도, 캘린더로 이어집니다.">
        {groups.map((group) => (
          <Pressable key={group.id} onPress={() => router.push(`/groups/${group.id}`)} style={styles.groupCard}>
            <View style={styles.groupHero}>
              <View style={styles.cover}>
                <Text style={styles.coverLabel}>{group.coverLabel}</Text>
              </View>
              <View style={styles.groupText}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupDescription}>{group.description}</Text>
              </View>
            </View>
            <View style={styles.groupMeta}>
              <InfoChip label={formatCountLabel(group.members, '명')} />
              <InfoChip label={`새 추억 ${group.newMoments}`} tone="primary" />
              <InfoChip label={group.lastActivityAt} tone="accent" />
            </View>
          </Pressable>
        ))}
      </SectionCard>

      <SectionCard title="회고 미리보기" description="주간/월간 회고 화면으로 연결되기 전 핵심 문장만 보여줍니다.">
        {recaps.map((recap) => (
          <View key={recap.id} style={styles.recapRow}>
            <Text style={styles.recapTitle}>{recap.title}</Text>
            <Text style={styles.recapText}>{recap.summary}</Text>
          </View>
        ))}
        <PrimaryButton label="회고 화면 열기" variant="secondary" onPress={() => router.push('/memories/recap')} />
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  groupCard: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    gap: 12,
  },
  groupHero: {
    flexDirection: 'row',
    gap: 12,
  },
  cover: {
    width: 88,
    height: 88,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  coverLabel: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  groupText: {
    flex: 1,
    gap: 6,
  },
  groupName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  groupDescription: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  groupMeta: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  recapRow: {
    gap: 6,
  },
  recapTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  recapText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
