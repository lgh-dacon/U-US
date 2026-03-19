/**
 * 역할: 그룹 단위 또는 전체 그룹 기준으로 게시글 피드를 스크롤형으로 보여주는 화면입니다.
 */
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/AppScreen';
import { InfoChip } from '../components/InfoChip';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../constants/colors';
import { useAppData } from '../context/AppDataProvider';
import { formatMediaType } from '../utils/format';

type FeedScreenProps = {
  scope: 'all' | 'group';
  groupId?: string;
};

export function FeedScreen({ scope, groupId }: FeedScreenProps) {
  const { groups, posts } = useAppData();
  const selectedGroup = groups.find((group) => group.id === groupId);
  const visiblePosts = scope === 'group' ? posts.filter((post) => post.groupId === groupId) : posts;

  return (
    <AppScreen
      header={
        <ScreenHeader
          eyebrow="Feed"
          title={scope === 'group' && selectedGroup ? `${selectedGroup.name} 피드` : '전체 그룹 피드'}
          description="최신 추억을 카드형 피드로 훑어보며 게시글 상세로 이동할 수 있습니다."
        />
      }
    >
      <SectionCard title="피드 리스트" description="실제 데이터 연결 시 pagination과 정렬 조건이 들어갈 자리입니다.">
        {visiblePosts.map((post) => (
          <Pressable key={post.id} onPress={() => router.push(`/posts/${post.id}`)} style={styles.feedCard}>
            <View style={styles.feedTop}>
              <Text style={styles.feedTitle}>{post.title}</Text>
              <InfoChip label={formatMediaType(post.mediaType)} tone="primary" />
            </View>
            <Text style={styles.feedBody}>{post.body}</Text>
            <View style={styles.metaRow}>
              <InfoChip label={post.createdAt} />
              <InfoChip label={post.locationName} tone="accent" />
              <InfoChip label={`좋아요 ${post.likeCount}`} />
            </View>
          </Pressable>
        ))}
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  feedCard: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    gap: 10,
  },
  feedTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  feedTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  feedBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
});
