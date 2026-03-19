/**
 * 역할: 앱 전체에서 재사용하는 TypeScript 타입 정의 파일입니다.
 * 화면과 mock 데이터가 같은 타입을 쓰도록 맞추면 나중에 실제 데이터 연결이 쉬워집니다.
 */
export type AuthMode = 'member' | 'guest';

export type User = {
  id: string;
  name: string;
  roleLabel: string;
  memoryCount: number;
  joinedAt: string;
  bio: string;
};

export type Group = {
  id: string;
  name: string;
  coverLabel: string;
  description: string;
  members: number;
  newMoments: number;
  inviteCode: string;
  tags: string[];
  lastActivityAt: string;
};

export type Comment = {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
};

export type Post = {
  id: string;
  groupId: string;
  authorName: string;
  title: string;
  body: string;
  mediaType: 'photo' | 'video';
  mediaCount: number;
  locationName: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  comments: Comment[];
};

export type Recap = {
  id: string;
  period: 'weekly' | 'monthly';
  title: string;
  summary: string;
  highlight: string;
  emotionKeyword: string;
};

export type ThenNowComparison = {
  id: string;
  title: string;
  thenLabel: string;
  nowLabel: string;
  story: string;
};

export type TimelineItem = {
  id: string;
  title: string;
  description: string;
  dateLabel: string;
  groupId: string;
};

export type CalendarTimelineMockExample = {
  selectedDate: string;
  highlightedDates: string[];
  note: string;
};

export type OnboardingSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
};

export type ScreenRequirement = {
  screen: string;
  purpose: string;
  requiredFields: string[];
  futureSourceHint: string;
};
