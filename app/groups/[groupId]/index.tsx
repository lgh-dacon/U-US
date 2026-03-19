/**
 * 역할: 선택한 그룹의 상세 화면을 연결하는 라우트 파일입니다.
 */
import { useLocalSearchParams } from 'expo-router';

import { GroupDetailScreen } from '../../../src/screens/GroupDetailScreen';

export default function GroupDetailRoute() {
  const params = useLocalSearchParams<{ groupId?: string }>();

  return <GroupDetailScreen groupId={params.groupId ?? ''} />;
}
