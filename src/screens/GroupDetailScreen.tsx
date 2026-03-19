/**
 * 역할: 그룹 안에서 피드, 지도, 캘린더, 업로드, 회고 화면으로 이동하는 허브 화면입니다.
 */
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/AppScreen';
import { InfoChip } from '../components/InfoChip';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../constants/colors';
import { useAppData } from '../context/AppDataProvider';

type GroupDetailScreenProps = {
  groupId: string;
};

export function GroupDetailScreen({ groupId }: GroupDetailScreenProps) {
  const { groups, posts } = useAppData();
  const group = groups.find((item) => item.id === groupId) ?? groups[0];
  const groupPosts = posts.filter((post) => post.groupId === group.id);

  return (
    <AppScreen
      header={
        <ScreenHeader
          eyebrow="Group Detail"
          title={group.name}
          description={group.description}
        />
      }
    >
      <SectionCard title="그룹 정보" description="그룹 메타 정보와 권한 관련 정보가 들어갈 자리입니다.">
        <View style={styles.metaRow}>
          <InfoChip label={`멤버 ${group.members}명`} />
          <InfoChip label={`초대코드 ${group.inviteCode}`} tone="primary" />
          <InfoChip label={group.lastActivityAt} tone="accent" />
        </View>
        <Text style={styles.caption}>태그: {group.tags.join(', ')}</Text>
      </SectionCard>

      <SectionCard title="탐색 메뉴" description="그룹 안의 기록을 다양한 관점으로 보는 핵심 화면들입니다.">
        <PrimaryButton label="피드형 조회" onPress={() => router.push(`/groups/${group.id}/feed`)} />
        <PrimaryButton label="지도형 조회" variant="secondary" onPress={() => router.push(`/groups/${group.id}/map`)} />
        <PrimaryButton label="캘린더형 조회" variant="secondary" onPress={() => router.push(`/groups/${group.id}/calendar`)} />
        <PrimaryButton label="사진/영상 업로드" variant="secondary" onPress={() => router.push('/upload')} />
      </SectionCard>

      <SectionCard title="최근 게시글" description="대표 게시글을 미리 보여주고 상세로 연결합니다.">
        {groupPosts.map((post) => (
          <Pressable key={post.id} onPress={() => router.push(`/posts/${post.id}`)} style={styles.postRow}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postBody}>{post.body}</Text>
          </Pressable>
        ))}
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  caption: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  postRow: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    gap: 6,
  },
  postTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  postBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
