/**
 * 역할: 선택한 그룹의 피드 화면을 연결하는 라우트 파일입니다.
 */
import { useLocalSearchParams } from 'expo-router';

import { FeedScreen } from '../../../src/screens/FeedScreen';

export default function GroupFeedRoute() {
  const params = useLocalSearchParams<{ groupId?: string }>();

  return <FeedScreen groupId={params.groupId} scope="group" />;
}
