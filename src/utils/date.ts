/**
 * 역할: mock 날짜 문자열을 캘린더 화면에서 쉽게 쓰도록 변환하는 간단한 날짜 유틸입니다.
 */
export type CalendarDayCell = {
  key: string;
  dayNumber: number;
  dateKey: string;
  inCurrentMonth: boolean;
};

export const calendarWeekdays = ['월', '화', '수', '목', '금', '토', '일'] as const;

export function parseDotDate(value: string) {
  const [yearText, monthText, dayText] = value.split('.');

  return {
    year: Number(yearText),
    month: Number(monthText),
    day: Number(dayText),
  };
}

export function toDateKey(parts: { year: number; month: number; day: number }) {
  const month = String(parts.month).padStart(2, '0');
  const day = String(parts.day).padStart(2, '0');

  return `${parts.year}-${month}-${day}`;
}

export function getMonthLabel(year: number, month: number) {
  return `${year}년 ${month}월`;
}

export function getCalendarCells(year: number, month: number): CalendarDayCell[] {
  const firstDate = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0);
  const startOffset = (firstDate.getDay() + 6) % 7;
  const cells: CalendarDayCell[] = [];

  for (let index = 0; index < startOffset; index += 1) {
    const previousDay = new Date(year, month - 1, -startOffset + index + 1);
    cells.push({
      key: `prev-${index}`,
      dayNumber: previousDay.getDate(),
      dateKey: toDateKey({
        year: previousDay.getFullYear(),
        month: previousDay.getMonth() + 1,
        day: previousDay.getDate(),
      }),
      inCurrentMonth: false,
    });
  }

  for (let day = 1; day <= lastDate.getDate(); day += 1) {
    cells.push({
      key: `current-${day}`,
      dayNumber: day,
      dateKey: toDateKey({ year, month, day }),
      inCurrentMonth: true,
    });
  }

  const remainingCount = (7 - (cells.length % 7 || 7)) % 7;

  for (let index = 1; index <= remainingCount; index += 1) {
    cells.push({
      key: `next-${index}`,
      dayNumber: index,
      dateKey: toDateKey({ year, month: month + 1, day: index }),
      inCurrentMonth: false,
    });
  }

  return cells;
}
