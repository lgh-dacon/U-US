/**
 * 역할: 선택한 그룹의 캘린더형 조회 화면을 연결하는 라우트 파일입니다.
 */
import { useLocalSearchParams } from 'expo-router';

import { CalendarViewScreen } from '../../../src/screens/CalendarViewScreen';

export default function GroupCalendarRoute() {
  const params = useLocalSearchParams<{ groupId?: string }>();

  return <CalendarViewScreen groupId={params.groupId ?? ''} />;
}
