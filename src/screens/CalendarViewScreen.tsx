/**
 * 역할: 그룹 추억을 날짜 단위로 확인할 수 있는 캘린더형 조회 화면입니다.
 */
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/AppScreen';
import { InfoChip } from '../components/InfoChip';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../constants/colors';
import { useAppData } from '../context/AppDataProvider';

type CalendarViewScreenProps = {
  groupId: string;
};

const calendarDays = ['월', '화', '수', '목', '금', '토', '일'];
const calendarGrid = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];

export function CalendarViewScreen({ groupId }: CalendarViewScreenProps) {
  const { groups, posts } = useAppData();
  const group = groups.find((item) => item.id === groupId) ?? groups[0];
  const groupPosts = posts.filter((post) => post.groupId === group.id);

  return (
    <AppScreen
      header={
        <ScreenHeader
          eyebrow="Calendar View"
          title={`${group.name}의 날짜별 기록`}
          description="특정 날짜를 눌렀을 때 그날의 게시글 목록과 회상 카드가 열리도록 확장할 수 있습니다."
        />
      }
    >
      <SectionCard title="월간 캘린더" description="달력 라이브러리 연결 전에도 정보 구조를 이해할 수 있게 단순한 박스로 보여줍니다.">
        <View style={styles.weekRow}>
          {calendarDays.map((day) => (
            <Text key={day} style={styles.weekday}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.grid}>
          {calendarGrid.map((day, index) => (
            <View key={day} style={[styles.cell, index % 5 === 0 ? styles.highlightCell : null]}>
              <Text style={styles.dayText}>{day}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard title="이번 달 기록" description="선택된 날짜에 연결될 대표 추억 샘플입니다.">
        {groupPosts.map((post) => (
          <View key={post.id} style={styles.postRow}>
            <Text style={styles.postTitle}>{post.createdAt}</Text>
            <InfoChip label={post.title} tone="primary" />
          </View>
        ))}
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cell: {
    width: '13%',
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightCell: {
    backgroundColor: colors.primarySoft,
  },
  dayText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  postRow: {
    gap: 8,
  },
  postTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
});
