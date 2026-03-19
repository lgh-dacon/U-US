/**
 * 역할: 사용자가 요청한 모든 화면을 한 번에 검수할 수 있도록 전체 라우트를 모아 보여주는 검수용 허브 화면입니다.
 */
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/AppScreen';
import { InfoChip } from '../components/InfoChip';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../constants/colors';
import { useAppData } from '../context/AppDataProvider';

type PreviewItem = {
  label: string;
  route: string;
  note: string;
};

export function ScreenPreviewScreen() {
  const { groups, posts } = useAppData();
  const groupId = groups[0]?.id ?? 'group-1';
  const postId = posts[0]?.id ?? 'post-1';

  const previewSections: Array<{ title: string; items: PreviewItem[] }> = [
    {
      title: '초기 진입',
      items: [
        { label: '온보딩 화면', route: '/onboarding', note: '스토리텔링 첫 화면' },
        { label: '로그인 / 게스트', route: '/login', note: '로그인과 게스트 진입' },
      ],
    },
    {
      title: '메인 구조',
      items: [
        { label: '홈', route: '/(tabs)', note: '그룹 리스트 홈' },
        { label: '전체 피드', route: '/(tabs)/feed', note: '그룹 전체 피드 조회' },
        { label: '타임라인', route: '/(tabs)/timeline', note: '시간순 이벤트 목록' },
        { label: '마이페이지', route: '/(tabs)/mypage', note: '프로필과 데이터 구조 안내' },
      ],
    },
    {
      title: '그룹 기능',
      items: [
        { label: '그룹 생성', route: '/groups/create', note: '새 그룹 생성 폼' },
        { label: '그룹 참여', route: '/groups/join', note: '초대 코드 참여' },
        { label: '그룹 상세', route: `/groups/${groupId}`, note: '그룹 허브 화면' },
        { label: '그룹 피드', route: `/groups/${groupId}/feed`, note: '그룹 전용 피드' },
        { label: '지도형 조회', route: `/groups/${groupId}/map`, note: '위치 중심 추억 조회' },
        { label: '캘린더형 조회', route: `/groups/${groupId}/calendar`, note: '날짜 중심 추억 조회' },
      ],
    },
    {
      title: '콘텐츠 기능',
      items: [
        { label: '사진/영상 업로드', route: '/upload', note: '업로드 스켈레톤' },
        { label: '게시글 상세', route: `/posts/${postId}`, note: '좋아요와 댓글 포함' },
      ],
    },
    {
      title: '회상 기능',
      items: [
        { label: '주간/월간 회고', route: '/memories/recap', note: '회고 카드형 화면' },
        { label: 'Then & Now', route: '/memories/then-now', note: '과거와 현재 비교' },
      ],
    },
  ];

  return (
    <AppScreen
      header={
        <ScreenHeader
          eyebrow="Preview Hub"
          title="요청하신 모든 화면을 여기서 바로 확인할 수 있습니다"
          description="실제 서비스에서는 모든 기능이 하단 탭일 필요는 없지만, 지금 단계에서는 검수를 위해 모든 화면을 한 번에 열 수 있게 구성했습니다."
        />
      }
    >
      <SectionCard title="검수 방식" description="아래 버튼을 누르면 각 화면으로 바로 이동합니다.">
        <View style={styles.chips}>
          <InfoChip label="온보딩 포함" tone="primary" />
          <InfoChip label="로그인 포함" tone="accent" />
          <InfoChip label="전체 기능 이동 가능" />
        </View>
      </SectionCard>

      {previewSections.map((section) => (
        <SectionCard key={section.title} title={section.title} description="각 항목은 실제 라우트와 연결되어 있습니다.">
          {section.items.map((item) => (
            <Pressable key={item.route} onPress={() => router.push(item.route as never)} style={styles.item}>
              <View style={styles.itemText}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Text style={styles.itemNote}>{item.note}</Text>
              </View>
              <InfoChip label="열기" tone="primary" />
            </Pressable>
          ))}
        </SectionCard>
      ))}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
  },
  itemText: {
    flex: 1,
    gap: 4,
  },
  itemLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  itemNote: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
