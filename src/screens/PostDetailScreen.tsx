/**
 * 역할: 게시글 본문, 좋아요, 댓글, 미디어 정보를 한 화면에서 보여주는 상세 화면입니다.
 */
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/AppScreen';
import { InfoChip } from '../components/InfoChip';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../constants/colors';
import { useAppData } from '../context/AppDataProvider';
import { formatMediaType } from '../utils/format';

type PostDetailScreenProps = {
  postId: string;
};

export function PostDetailScreen({ postId }: PostDetailScreenProps) {
  const { posts } = useAppData();
  const post = posts.find((item) => item.id === postId) ?? posts[0];

  return (
    <AppScreen
      header={
        <ScreenHeader
          eyebrow={post.authorName}
          title={post.title}
          description="상세 화면에서는 게시글 정보와 상호작용 요소를 함께 모아둡니다."
        />
      }
    >
      <SectionCard title="게시글 내용" description="미디어 캐러셀 대신 시각적 Placeholder를 두고 실제 연결 지점을 남겨둡니다.">
        <View style={styles.mediaBlock}>
          <Text style={styles.mediaTitle}>{formatMediaType(post.mediaType)} {post.mediaCount}개</Text>
          <Text style={styles.mediaText}>여기에 실제 이미지/영상 썸네일이 들어갑니다.</Text>
        </View>
        <Text style={styles.body}>{post.body}</Text>
        <View style={styles.metaRow}>
          <InfoChip label={post.createdAt} />
          <InfoChip label={post.locationName} tone="accent" />
        </View>
      </SectionCard>

      <SectionCard title="좋아요 / 댓글" description="실제 좋아요 토글과 댓글 작성 API가 연결될 자리입니다.">
        <View style={styles.metaRow}>
          <InfoChip label={`좋아요 ${post.likeCount}`} tone="primary" />
          <InfoChip label={`댓글 ${post.commentCount}`} />
        </View>
        <PrimaryButton label="좋아요 버튼 자리" />
        <Text style={styles.commentInput}>댓글을 남기는 입력창 Placeholder</Text>
        {post.comments.map((comment) => (
          <View key={comment.id} style={styles.commentCard}>
            <Text style={styles.commentAuthor}>{comment.authorName}</Text>
            <Text style={styles.commentBody}>{comment.content}</Text>
            <Text style={styles.commentDate}>{comment.createdAt}</Text>
          </View>
        ))}
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  mediaBlock: {
    height: 220,
    borderRadius: 24,
    backgroundColor: colors.backgroundStrong,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  mediaTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  mediaText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  body: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  commentInput: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.textMuted,
    fontSize: 14,
  },
  commentCard: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    gap: 4,
  },
  commentAuthor: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  commentBody: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  commentDate: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
