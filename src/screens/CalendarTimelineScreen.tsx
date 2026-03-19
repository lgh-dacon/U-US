/**
 * 역할: 전체 추억 이력을 달력 중심으로 조회하고, 특정 날짜를 눌렀을 때 해당 날짜 게시글을 보여주는 화면입니다.
 * 나중에 실제 데이터 연결 시 posts.createdAt, posts.groupId, posts.title 같은 필드를 그대로 활용하면 됩니다.
 */
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/AppScreen';
import { InfoChip } from '../components/InfoChip';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../constants/colors';
import { useAppData } from '../context/AppDataProvider';
import { calendarWeekdays, getCalendarCells, getMonthLabel, parseDotDate, toDateKey } from '../utils/date';

export function CalendarTimelineScreen() {
  const { groups, posts, calendarTimelineMockExample } = useAppData();

  const latestPost = posts[0];
  const latestDate = latestPost ? parseDotDate(latestPost.createdAt) : { year: 2026, month: 3, day: 1 };
  const [viewMonth] = useState({ year: latestDate.year, month: latestDate.month });
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(latestDate));

  const postMapByDate = useMemo(() => {
    return posts.reduce<Record<string, typeof posts>>((accumulator, post) => {
      const dateKey = toDateKey(parseDotDate(post.createdAt));

      if (!accumulator[dateKey]) {
        accumulator[dateKey] = [];
      }

      accumulator[dateKey].push(post);
      return accumulator;
    }, {});
  }, [posts]);

  const calendarCells = useMemo(
    () => getCalendarCells(viewMonth.year, viewMonth.month),
    [viewMonth.month, viewMonth.year]
  );

  const selectedPosts = postMapByDate[selectedDateKey] ?? [];

  return (
    <AppScreen
      header={
        <ScreenHeader
          eyebrow="Calendar History"
          title="전체 추억 이력을 달력으로 돌아봅니다"
          description="이제 Timeline 탭은 단순 리스트가 아니라, 기록이 쌓인 날짜를 달력에서 바로 확인하는 히스토리 화면입니다."
        />
      }
    >
      <SectionCard
        title="월간 캘린더"
        description="점이 있는 날짜는 게시물이 존재하는 날입니다. 날짜를 누르면 아래에서 그날의 추억 목록을 볼 수 있습니다."
      >
        <View style={styles.headerRow}>
          <Text style={styles.monthLabel}>{getMonthLabel(viewMonth.year, viewMonth.month)}</Text>
          <InfoChip label={`mock 예시: ${calendarTimelineMockExample.selectedDate}`} tone="accent" />
        </View>

        <View style={styles.weekRow}>
          {calendarWeekdays.map((weekday) => (
            <Text key={weekday} style={styles.weekday}>
              {weekday}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {calendarCells.map((cell) => {
            const postsOnDate = postMapByDate[cell.dateKey] ?? [];
            const isSelected = selectedDateKey === cell.dateKey;

            return (
              <Pressable
                key={cell.key}
                onPress={() => setSelectedDateKey(cell.dateKey)}
                style={[
                  styles.dayCell,
                  !cell.inCurrentMonth ? styles.outsideDayCell : null,
                  postsOnDate.length > 0 ? styles.markedDayCell : null,
                  isSelected ? styles.selectedDayCell : null,
                ]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    !cell.inCurrentMonth ? styles.outsideDayText : null,
                    isSelected ? styles.selectedDayText : null,
                  ]}
                >
                  {cell.dayNumber}
                </Text>

                {postsOnDate.length > 0 ? (
                  <View style={styles.dotRow}>
                    {postsOnDate.slice(0, 3).map((post) => (
                      <View key={post.id} style={styles.dot} />
                    ))}
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </SectionCard>

      <SectionCard
        title={`${selectedDateKey}의 추억`}
        description="선택한 날짜와 연결된 게시글을 아래 리스트로 보여줍니다."
      >
        {selectedPosts.length > 0 ? (
          selectedPosts.map((post) => {
            const groupName = groups.find((group) => group.id === post.groupId)?.name ?? '그룹 미확인';

            return (
              <Pressable key={post.id} onPress={() => router.push(`/posts/${post.id}`)} style={styles.postCard}>
                <View style={styles.postTop}>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <InfoChip label={groupName} tone="primary" />
                </View>
                <Text style={styles.postBody}>{post.body}</Text>
                <View style={styles.metaRow}>
                  <InfoChip label={post.createdAt} />
                  <InfoChip label={post.locationName} tone="accent" />
                  <InfoChip label={`댓글 ${post.commentCount}`} />
                </View>
              </Pressable>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>이 날짜에는 아직 연결된 mock 게시물이 없습니다</Text>
            <Text style={styles.emptyText}>
              나중에 실제 데이터 연결 시 `posts.createdAt`을 날짜 기준으로 묶어 이 영역에 보여주면 됩니다.
            </Text>
          </View>
        )}
      </SectionCard>

      <SectionCard
        title="나중에 실제 데이터 연결 시 필요한 필드"
        description="초보자 기준으로, 이 화면은 아래 필드만 이해해도 충분히 연결할 수 있습니다."
      >
        <Text style={styles.fieldText}>`posts.id`: 날짜 선택 후 상세 이동에 사용</Text>
        <Text style={styles.fieldText}>`posts.createdAt`: 달력 날짜 표시와 그룹핑 기준</Text>
        <Text style={styles.fieldText}>`posts.title`, `posts.body`: 선택 날짜 게시글 리스트 표시</Text>
        <Text style={styles.fieldText}>`posts.groupId`: 어떤 그룹의 추억인지 함께 보여주기 위해 사용</Text>
        <Text style={styles.fieldText}>`posts.locationName`: 날짜별 추억 보조 정보로 표시</Text>
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  monthLabel: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayCell: {
    width: '13%',
    minWidth: 44,
    aspectRatio: 0.9,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    paddingTop: 10,
    alignItems: 'center',
    gap: 8,
  },
  outsideDayCell: {
    opacity: 0.45,
  },
  markedDayCell: {
    backgroundColor: colors.surfaceElevated,
  },
  selectedDayCell: {
    borderColor: colors.secondary,
    backgroundColor: colors.primarySoft,
  },
  dayNumber: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  outsideDayText: {
    color: colors.textSoft,
  },
  selectedDayText: {
    color: colors.white,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
    minHeight: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  postCard: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    gap: 8,
  },
  postTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  postTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  postBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  emptyState: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    gap: 8,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  fieldText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
});
