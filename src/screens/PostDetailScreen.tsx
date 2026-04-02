/**
 * 역할: 게시글 상세 화면 - 큰 사진, 캡션, 좋아요/댓글, 댓글 목록을 보여줍니다.
 * Figma: U_US_4상세피드.png, U_US_4상세피드-1.png, U_US_8캘린더2-5.png
 */
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';

import { colors } from '../constants/colors';
import { useAppData } from '../context/AppDataProvider';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PHOTO_HEIGHT = Dimensions.get('window').height * 0.55;

export default function PostDetailScreen() {
  const router = useRouter();
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { posts, galleryPhotos } = useAppData();

  // Try to find as a post first, then fall back to gallery photo
  const post = posts.find((p) => p.id === postId);
  const galleryPhoto = galleryPhotos.find((p) => p.id === postId);

  const photoUri = post?.photoUri ?? galleryPhoto?.uri;
  const authorName = post?.authorName ?? galleryPhoto?.authorName ?? '';
  const title = post?.title ?? galleryPhoto?.caption ?? '';
  const body = post?.body ?? '';
  const createdAt = post?.createdAt ?? galleryPhoto?.createdAt ?? '';
  const likeCount = post?.likeCount ?? galleryPhoto?.likeCount ?? 0;
  const commentCount = post?.commentCount ?? galleryPhoto?.commentCount ?? 0;
  const comments = post?.comments ?? galleryPhoto?.comments ?? [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={{ fontSize: 24, color: colors.white }}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>우리의 작은 일상</Text>
        <View style={styles.headerRight}>
          <Pressable>
            <Text style={{ fontSize: 22, color: colors.white }}>⋯</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Large Photo */}
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.mainPhoto}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.mainPhoto, styles.photoPlaceholder]}>
            <Text style={{ fontSize: 56, color: colors.textSoft }}>🖼</Text>
          </View>
        )}

        {/* Caption / Title */}
        <View style={styles.captionSection}>
          {title ? <Text style={styles.captionText}>{title}</Text> : null}
          {body ? <Text style={styles.bodyText}>{body}</Text> : null}
        </View>

        {/* Author Row */}
        <View style={styles.authorRow}>
          <View style={styles.authorAvatar}>
            <Text style={styles.authorAvatarText}>
              {authorName.charAt(0)}
            </Text>
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{authorName}</Text>
            <Text style={styles.authorTimestamp}>{createdAt}</Text>
          </View>
        </View>

        {/* Action Bar */}
        <View style={styles.actionBar}>
          <Pressable style={styles.actionItem}>
            <Ionicons name="heart-outline" size={22} color={colors.white} />
            <Text style={styles.actionCount}>{likeCount}</Text>
          </Pressable>
          <Pressable style={styles.actionItem}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.white} />
            <Text style={styles.actionCount}>{commentCount}</Text>
          </Pressable>
          <Pressable style={styles.actionItem}>
            <Ionicons name="share-outline" size={20} color={colors.white} />
          </Pressable>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          {comments.length > 0 && (
            <Text style={styles.commentsTitle}>댓글 {comments.length}</Text>
          )}
          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <View style={styles.commentAvatar}>
                  <Text style={styles.commentAvatarText}>
                    {comment.authorName.charAt(0)}
                  </Text>
                </View>
                <View style={styles.commentMeta}>
                  <Text style={styles.commentAuthor}>{comment.authorName}</Text>
                  <Text style={styles.commentTimestamp}>{comment.createdAt}</Text>
                </View>
              </View>
              <Text style={styles.commentBody}>{comment.content}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View style={styles.commentInputBar}>
        <View style={styles.commentInputAvatar}>
          <Ionicons name="person" size={16} color={colors.textSoft} />
        </View>
        <TextInput
          style={styles.commentInput}
          placeholder="댓글을 입력하세요"
          placeholderTextColor={colors.textSoft}
          editable={false}
        />
        <Pressable style={styles.commentSendButton}>
          <Ionicons name="arrow-up-circle" size={28} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },

  scrollContent: {
    paddingBottom: 100,
  },

  /* Main Photo */
  mainPhoto: {
    width: SCREEN_WIDTH,
    height: PHOTO_HEIGHT,
    backgroundColor: colors.surface,
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Caption */
  captionSection: {
    paddingHorizontal: 18,
    paddingTop: 16,
    gap: 6,
  },
  captionText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
  },
  bodyText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },

  /* Author Row */
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    gap: 10,
  },
  authorAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorAvatarText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  authorInfo: {
    gap: 2,
  },
  authorName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  authorTimestamp: {
    color: colors.textSoft,
    fontSize: 12,
  },

  /* Action Bar */
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 16,
    gap: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionCount: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },

  /* Divider */
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: 18,
    marginTop: 16,
  },

  /* Comments */
  commentsSection: {
    paddingHorizontal: 18,
    paddingTop: 14,
    gap: 14,
  },
  commentsTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  commentCard: {
    gap: 6,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentAvatarText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentAuthor: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  commentTimestamp: {
    color: colors.textSoft,
    fontSize: 11,
  },
  commentBody: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    paddingLeft: 34,
  },

  /* Comment Input Bar */
  commentInputBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 34,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  commentInputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentInput: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 14,
  },
  commentSendButton: {
    width: 32,
    alignItems: 'center',
  },
});
