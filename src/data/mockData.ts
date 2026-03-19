/**
 * 역할: 지금 앱에서 사용하는 모든 mock 데이터 모음입니다.
 * 나중에 실제 데이터 연결 전까지는 이 파일만 수정해도 화면 내용이 바뀝니다.
 */
import {
  Group,
  OnboardingSlide,
  Post,
  Recap,
  ScreenRequirement,
  CalendarTimelineMockExample,
  ThenNowComparison,
  TimelineItem,
  User,
} from '../types/app';

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 'slide-1',
    eyebrow: '우리만의 기록',
    title: '추억은 흩어지지 않게, 한 공간에 차곡차곡',
    description:
      '소중한 사람들과 함께 사진, 영상, 짧은 글을 남기며 지금의 감정을 오래 간직하는 경험을 보여줍니다.',
  },
  {
    id: 'slide-2',
    eyebrow: '함께 보는 시간',
    title: '그날의 순간을 서로의 시선으로 다시 만나요',
    description:
      '같은 하루도 각자 다른 마음으로 기억됩니다. 그룹 안에서 같은 장면을 여러 기억으로 연결합니다.',
  },
  {
    id: 'slide-3',
    eyebrow: '회상과 비교',
    title: '지난 계절의 우리와 오늘의 우리를 나란히',
    description:
      '주간, 월간 회고와 Then & Now 비교를 통해 시간이 쌓이는 감정을 시각적으로 다시 돌아보게 합니다.',
  },
];

export const currentUser: User = {
  id: 'user-1',
  name: '민지',
  roleLabel: '가족 기록자',
  memoryCount: 128,
  joinedAt: '2026.01.10',
  bio: '가족과 여행 기록을 모으는 첫 번째 멤버',
};

export const groups: Group[] = [
  {
    id: 'group-1',
    name: '우리 가족 앨범',
    coverLabel: 'Spring Picnic',
    description: '가족 여행, 생일, 일상의 작은 순간을 함께 저장하는 메인 그룹',
    members: 5,
    newMoments: 12,
    inviteCode: 'FAMILY-2026',
    tags: ['가족', '주말', '여행'],
    lastActivityAt: '오늘 오후 2:30',
  },
  {
    id: 'group-2',
    name: '대학 친구들',
    coverLabel: 'Campus Days',
    description: '졸업 후에도 계속 이어지는 친구들과의 추억 기록 공간',
    members: 8,
    newMoments: 4,
    inviteCode: 'CAMPUS-82',
    tags: ['친구', '추억', '모임'],
    lastActivityAt: '어제 밤 11:15',
  },
];

export const posts: Post[] = [
  {
    id: 'post-1',
    groupId: 'group-1',
    authorName: '민지',
    title: '벚꽃 아래 첫 가족 사진',
    body: '오랜만에 전원이 모여서 돗자리를 펴고 도시락을 나눠 먹은 날. 올해도 같은 자리에 다시 오고 싶어요.',
    mediaType: 'photo',
    mediaCount: 6,
    locationName: '서울숲',
    createdAt: '2026.03.16',
    likeCount: 24,
    commentCount: 3,
    comments: [
      { id: 'comment-1', authorName: '엄마', content: '햇빛이 정말 예쁘게 들어왔네.', createdAt: '1시간 전' },
      { id: 'comment-2', authorName: '동생', content: '다음엔 강아지도 같이 가자.', createdAt: '45분 전' },
      { id: 'comment-3', authorName: '아빠', content: '도시락 담당은 또 나인가?', createdAt: '30분 전' },
    ],
  },
  {
    id: 'post-2',
    groupId: 'group-1',
    authorName: '엄마',
    title: '생일 저녁 준비 완료',
    body: '케이크 초를 켜기 전, 부엌에서 분주하게 움직이던 순간도 기억하고 싶어서 남깁니다.',
    mediaType: 'video',
    mediaCount: 1,
    locationName: '집',
    createdAt: '2026.03.09',
    likeCount: 17,
    commentCount: 2,
    comments: [
      { id: 'comment-4', authorName: '민지', content: '주방 비하인드가 더 감동적이야.', createdAt: '2일 전' },
      { id: 'comment-5', authorName: '동생', content: '내 접시도 보인다.', createdAt: '2일 전' },
    ],
  },
  {
    id: 'post-3',
    groupId: 'group-2',
    authorName: '수연',
    title: '졸업 후 첫 재회',
    body: '각자 다른 도시에서 지내다가 오랜만에 한자리에 모였던 날. 웃음소리가 그대로였다.',
    mediaType: 'photo',
    mediaCount: 4,
    locationName: '혜화',
    createdAt: '2026.02.21',
    likeCount: 31,
    commentCount: 1,
    comments: [{ id: 'comment-6', authorName: '민지', content: '다음엔 꼭 1박으로 모이자.', createdAt: '지난주' }],
  },
];

export const recaps: Recap[] = [
  {
    id: 'recap-weekly',
    period: 'weekly',
    title: '이번 주의 우리',
    summary: '서울숲 피크닉과 생일 저녁 준비가 가장 많이 회상된 장면이었어요.',
    highlight: '총 9개의 사진과 1개의 영상이 새로 기록되었어요.',
    emotionKeyword: '따뜻함',
  },
  {
    id: 'recap-monthly',
    period: 'monthly',
    title: '이번 달의 추억',
    summary: '가족 그룹은 야외 활동, 친구 그룹은 재회 기록이 중심이었어요.',
    highlight: '가장 반응이 좋았던 게시글은 "벚꽃 아래 첫 가족 사진"입니다.',
    emotionKeyword: '설렘',
  },
];

export const thenNowComparisons: ThenNowComparison[] = [
  {
    id: 'compare-1',
    title: '같은 공원, 다른 계절',
    thenLabel: '2024 봄 첫 소풍',
    nowLabel: '2026 봄 다시 찾은 자리',
    story: '예전엔 아이들이 뛰어다녔고, 지금은 함께 도시락 메뉴를 상의하며 더 긴 시간을 보냅니다.',
  },
  {
    id: 'compare-2',
    title: '졸업식에서 동창회까지',
    thenLabel: '졸업 당일',
    nowLabel: '첫 재회 모임',
    story: '사진 속 표정은 달라졌지만, 서로의 이야기를 듣는 집중력은 그대로 남아 있습니다.',
  },
];

export const timelineItems: TimelineItem[] = [
  {
    id: 'timeline-1',
    title: '벚꽃 피크닉 업로드',
    description: '가족 그룹에 새 추억 6장이 추가되었습니다.',
    dateLabel: '2026.03.16',
    groupId: 'group-1',
  },
  {
    id: 'timeline-2',
    title: '생일 저녁 영상 기록',
    description: '짧은 영상 1개가 회고 후보에 추가되었습니다.',
    dateLabel: '2026.03.09',
    groupId: 'group-1',
  },
  {
    id: 'timeline-3',
    title: '친구들 재회 기록',
    description: '친구 그룹의 월간 회고 카드가 갱신되었습니다.',
    dateLabel: '2026.02.21',
    groupId: 'group-2',
  },
];

/**
 * 역할: 캘린더 기반 타임라인 화면에서 어떤 식으로 날짜-게시글 연결이 되는지 보여주는 mock 예시입니다.
 * 실제 연결 시에는 posts.createdAt 값을 같은 형식으로 사용하면 됩니다.
 */
export const calendarTimelineMockExample: CalendarTimelineMockExample = {
  selectedDate: '2026-03-16',
  highlightedDates: ['2026-03-16', '2026-03-09', '2026-02-21'],
  note: '달력 점 표시와 날짜별 게시글 연결은 posts.createdAt 기준으로 처리합니다.',
};

export const screenRequirements: ScreenRequirement[] = [
  {
    screen: '온보딩',
    purpose: '서비스의 감정적 가치와 그룹 기반 구조를 첫 진입에서 전달',
    requiredFields: ['슬라이드 제목', '설명 문구', 'CTA 문구'],
    futureSourceHint: 'CMS나 원격 설정으로 메시지 실험 가능',
  },
  {
    screen: '로그인/게스트',
    purpose: '회원 진입과 게스트 체험을 분리',
    requiredFields: ['로그인 방식', '게스트 권한 범위', '약관 링크'],
    futureSourceHint: 'Supabase Auth 또는 Firebase Auth 연결',
  },
  {
    screen: '홈',
    purpose: '내가 속한 그룹 목록과 최근 활동을 요약',
    requiredFields: ['그룹 목록', '최근 활동 수', '초대 코드'],
    futureSourceHint: 'groups, memberships, activity 테이블',
  },
  {
    screen: '그룹 상세',
    purpose: '한 그룹 안에서 피드, 지도, 캘린더, 업로드 흐름으로 이동',
    requiredFields: ['그룹 정보', '대표 추억', '멤버 수', '최근 게시글'],
    futureSourceHint: 'groups + posts + members 조합 조회',
  },
  {
    screen: '게시글 상세',
    purpose: '콘텐츠, 좋아요, 댓글을 한 번에 확인',
    requiredFields: ['게시글 본문', '미디어 목록', '좋아요 수', '댓글 목록'],
    futureSourceHint: 'posts, likes, comments 컬렉션',
  },
  {
    screen: '회고/Then & Now',
    purpose: '시간 흐름에 따른 감정과 변화를 요약',
    requiredFields: ['기간 정보', '요약 문구', '비교 대상 2개'],
    futureSourceHint: '집계 API 또는 배치 생성 데이터',
  },
];
