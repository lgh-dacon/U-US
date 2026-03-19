/**
 * 역할: 기존 탭 이름(Timeline)을 유지하면서, 실제 구현은 캘린더 기반 히스토리 화면으로 연결하는 래퍼 파일입니다.
 * 초보자는 "탭용 파일"과 "실제 화면 파일"을 분리해서 보면 구조를 이해하기 쉽습니다.
 */
import { CalendarTimelineScreen } from './CalendarTimelineScreen';

export function TimelineScreen() {
  return <CalendarTimelineScreen />;
}
