/**
 * Figma 디자인 기반 타입 정의
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

export type PlanetGroup = {
  id: string;
  name: string;
  subtitle: string;
  members: string[];
  photoCount: number;
  videoCount: number;
  planetSize: number; // relative size for display
  planetColor: string;
};

export type GalleryPhoto = {
  id: string;
  groupId: string;
  uri: string;
  authorName: string;
  caption: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  comments: Comment[];
};

export type Comment = {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
};

export type CalendarDay = {
  date: string; // YYYY-MM-DD
  photoUri?: string;
  postId?: string;
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
  photoUri?: string;
};

export type OnboardingSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
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
