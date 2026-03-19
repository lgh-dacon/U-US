/**
 * 역할: 게시글 상세 화면을 연결하는 라우트 파일입니다.
 */
import { useLocalSearchParams } from 'expo-router';

import { PostDetailScreen } from '../../src/screens/PostDetailScreen';

export default function PostDetailRoute() {
  const params = useLocalSearchParams<{ postId?: string }>();

  return <PostDetailScreen postId={params.postId ?? ''} />;
}
