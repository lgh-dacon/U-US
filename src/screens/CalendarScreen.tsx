/**
 * 역할: 캘린더 화면 - 월별 사진 캘린더 그리드를 보여주는 화면입니다.
 * Figma: U_US_7캘린더1.png
 */
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '../constants/colors';
import { useAppData } from '../context/AppDataProvider';

const SCREEN_WIDTH = Dimensions.get('window').width;
const HORIZONTAL_PADDING = 16;
const CELL_GAP = 4;
const NUM_COLUMNS = 7;
const CELL_SIZE = Math.floor(
  (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CELL_GAP * (NUM_COLUMNS - 1)) /
    NUM_COLUMNS
);

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const TODAY = '2026-03-26';

type MonthData = {
  year: number;
  month: number; // 0-indexed
  label: string;
  yearLabel: string;
  days: (number | null)[];
};

function generateMonthData(year: number, month: number): MonthData {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];
  // Leading empty cells for alignment
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  return {
    year,
    month,
    label: monthNames[month],
    yearLabel: String(year),
    days,
  };
}

function formatDate(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export default function CalendarScreen() {
  const router = useRouter();
  const { calendarDays, planetGroups } = useAppData();

  const activeGroup = planetGroups[0];

  // Build a lookup map: date string -> calendarDay entry
  const dayMap = useMemo(() => {
    const map = new Map<string, (typeof calendarDays)[number]>();
    calendarDays.forEach((cd) => map.set(cd.date, cd));
    return map;
  }, [calendarDays]);

  const months = useMemo<MonthData[]>(() => {
    return [
      generateMonthData(2026, 2), // March
      generateMonthData(2026, 3), // April
    ];
  }, []);

  const handleDayPress = (dateStr: string) => {
    const entry = dayMap.get(dateStr);
    if (entry?.postId) {
      router.push(`/post/${entry.postId}` as any);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.groupName}>{activeGroup?.name ?? '우리의 작은 일상'}</Text>
          <Pressable onPress={() => router.push('/planet' as any)}>
            <Text style={styles.planetInfoLink}>Planet Info</Text>
          </Pressable>
        </View>

        {/* Months */}
        {months.map((monthData) => (
          <View key={`${monthData.year}-${monthData.month}`} style={styles.monthBlock}>
            {/* Month title */}
            <View style={styles.monthHeader}>
              <Text style={styles.monthLabel}>{monthData.label}</Text>
              <Text style={styles.yearLabel}>{monthData.yearLabel}</Text>
            </View>

            {/* Day-of-week headers */}
            <View style={styles.weekRow}>
              {DAY_LABELS.map((label, idx) => (
                <View key={idx} style={styles.weekCell}>
                  <Text
                    style={[
                      styles.weekText,
                      idx === 0 && styles.sundayText,
                      idx === 6 && styles.saturdayText,
                    ]}
                  >
                    {label}
                  </Text>
                </View>
              ))}
            </View>

            {/* Calendar grid */}
            <View style={styles.grid}>
              {monthData.days.map((day, idx) => {
                if (day === null) {
                  return <View key={`empty-${idx}`} style={styles.cell} />;
                }

                const dateStr = formatDate(monthData.year, monthData.month, day);
                const entry = dayMap.get(dateStr);
                const isToday = dateStr === TODAY;

                return (
                  <Pressable
                    key={dateStr}
                    style={[styles.cell, isToday && styles.todayCell]}
                    onPress={() => handleDayPress(dateStr)}
                  >
                    {entry?.photoUri ? (
                      <Image
                        source={{ uri: entry.photoUri }}
                        style={styles.thumbnail}
                      />
                    ) : (
                      <Text style={[styles.dayNumber, isToday && styles.todayText]}>
                        {day}
                      </Text>
                    )}
                    {isToday && <View style={styles.todayDot} />}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  groupName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  planetInfoLink: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '500',
  },
  monthBlock: {
    marginBottom: 36,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 16,
  },
  monthLabel: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  yearLabel: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '500',
  },
  weekRow: {
    flexDirection: 'row',
    gap: CELL_GAP,
    marginBottom: 6,
  },
  weekCell: {
    width: CELL_SIZE,
    alignItems: 'center',
    paddingVertical: 4,
  },
  weekText: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '500',
  },
  sundayText: {
    color: colors.danger,
  },
  saturdayText: {
    color: colors.secondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 6,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  todayCell: {
    borderWidth: 1.5,
    borderColor: '#34D399',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  dayNumber: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: '500',
  },
  todayText: {
    color: colors.text,
    fontWeight: '700',
  },
  todayDot: {
    position: 'absolute',
    bottom: 3,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#34D399',
  },
});
