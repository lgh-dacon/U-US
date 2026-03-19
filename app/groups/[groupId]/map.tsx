/**
 * 역할: 선택한 그룹의 지도형 조회 화면을 연결하는 라우트 파일입니다.
 */
import { useLocalSearchParams } from 'expo-router';

import { MapViewScreen } from '../../../src/screens/MapViewScreen';

export default function GroupMapRoute() {
  const params = useLocalSearchParams<{ groupId?: string }>();

  return <MapViewScreen groupId={params.groupId ?? ''} />;
}
