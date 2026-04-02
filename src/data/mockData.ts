/**
 * Figma 디자인 기반 mock 데이터
 */
import {
  CalendarDay,
  GalleryPhoto,
  OnboardingSlide,
  PlanetGroup,
  Post,
  User,
} from '../types/app';

export const currentUser: User = {
  id: 'user-1',
  name: '민지',
  roleLabel: '가족 기록자',
  memoryCount: 128,
  joinedAt: '2026.01.10',
  bio: '가족과 여행 기록을 모으는 첫 번째 멤버',
};

export const planetGroups: PlanetGroup[] = [
  {
    id: 'group-1',
    name: '우리의 작은 일상',
    subtitle: '아빠효은, 윤승은',
    members: ['아빠효은', '윤승은'],
    photoCount: 1028,
    videoCount: 13,
    planetSize: 1.0,
    planetColor: '#4A90D9',
  },
  {
    id: 'group-2',
    name: '단란한 우리 가족',
    subtitle: '볼리요츠, 신원양, 신호요, 남용은',
    members: ['볼리요츠', '신원양', '신호요', '남용은'],
    photoCount: 681,
    videoCount: 30,
    planetSize: 0.8,
    planetColor: '#C4724A',
  },
  {
    id: 'group-3',
    name: '2020 MIAMI FAM',
    subtitle: 'Halley, NiLi, KiKu',
    members: ['Halley', 'NiLi', 'KiKu'],
    photoCount: 1008,
    videoCount: 30,
    planetSize: 0.65,
    planetColor: '#D4A056',
  },
];

// 그룹별 갤러리 사진
const group1Photos = [
  'https://picsum.photos/seed/g1beach/400/400',
  'https://picsum.photos/seed/g1sunset/400/400',
  'https://picsum.photos/seed/g1city/400/400',
  'https://picsum.photos/seed/g1food/400/400',
  'https://picsum.photos/seed/g1cafe/400/400',
  'https://picsum.photos/seed/g1park/400/400',
  'https://picsum.photos/seed/g1night/400/400',
  'https://picsum.photos/seed/g1travel/400/400',
  'https://picsum.photos/seed/g1home/400/400',
  'https://picsum.photos/seed/g1books/400/400',
];
const group1Captions = [
  '바다가 참 예뻐서 찍은 날', '노을이 지는 순간', '거리를 걷다가',
  '맛있는 것들', '카페에서', '공원 산책', '밤 풍경', '여행의 기억',
  '집에서 보낸 하루', '읽고 있는 책',
];

const group2Photos = [
  'https://picsum.photos/seed/g2dinner/400/400',
  'https://picsum.photos/seed/g2garden/400/400',
  'https://picsum.photos/seed/g2holiday/400/400',
  'https://picsum.photos/seed/g2cooking/400/400',
  'https://picsum.photos/seed/g2walk/400/400',
  'https://picsum.photos/seed/g2pet/400/400',
  'https://picsum.photos/seed/g2morning/400/400',
  'https://picsum.photos/seed/g2snow/400/400',
];
const group2Captions = [
  '온 가족이 모인 저녁', '정원에서 보낸 오후', '명절 풍경',
  '같이 요리한 날', '산책길에서', '반려동물과 함께', '아침 풍경', '첫눈 오던 날',
];

const group3Photos = [
  'https://picsum.photos/seed/g3miami1/400/400',
  'https://picsum.photos/seed/g3miami2/400/400',
  'https://picsum.photos/seed/g3miami3/400/400',
  'https://picsum.photos/seed/g3miami4/400/400',
  'https://picsum.photos/seed/g3miami5/400/400',
  'https://picsum.photos/seed/g3miami6/400/400',
  'https://picsum.photos/seed/g3miami7/400/400',
  'https://picsum.photos/seed/g3miami8/400/400',
  'https://picsum.photos/seed/g3miami9/400/400',
  'https://picsum.photos/seed/g3miami10/400/400',
  'https://picsum.photos/seed/g3miami11/400/400',
  'https://picsum.photos/seed/g3miami12/400/400',
];
const group3Captions = [
  'South Beach sunset', 'Ocean Drive vibes', 'Art Deco district',
  'Cuban coffee break', 'Pool day', 'Night out', 'Wynwood Walls',
  'Key Biscayne', 'Little Havana', 'Boat trip', 'Brunch spot', 'Skyline view',
];

function buildPhotos(groupId: string, uris: string[], captions: string[], authors: string[]): GalleryPhoto[] {
  return uris.map((uri, i) => ({
    id: `${groupId}-photo-${i + 1}`,
    groupId,
    uri,
    authorName: authors[i % authors.length],
    caption: captions[i % captions.length],
    createdAt: `2026.03.${String(26 - i).padStart(2, '0')}`,
    likeCount: Math.floor(Math.random() * 30) + 5,
    commentCount: Math.floor(Math.random() * 10),
    comments: [
      { id: `c-${groupId}-${i}`, authorName: authors[(i + 1) % authors.length], content: '좋다!', createdAt: '1시간 전' },
    ],
  }));
}

export const galleryPhotos: GalleryPhoto[] = [
  ...buildPhotos('group-1', group1Photos, group1Captions, ['민지', '엄마']),
  ...buildPhotos('group-2', group2Photos, group2Captions, ['볼리요츠', '신원양', '신호요']),
  ...buildPhotos('group-3', group3Photos, group3Captions, ['Hailey', 'MJ', 'KiKu']),
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
    photoUri: 'https://picsum.photos/seed/cherry1/400/500',
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
    photoUri: 'https://picsum.photos/seed/bday2/400/500',
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
    photoUri: 'https://picsum.photos/seed/reunion3/400/500',
    comments: [
      { id: 'comment-6', authorName: '민지', content: '다음엔 꼭 1박으로 모이자.', createdAt: '지난주' },
    ],
  },
];

export const calendarDays: CalendarDay[] = [
  { date: '2026-03-03', photoUri: 'https://picsum.photos/seed/cal1/100/100', postId: 'post-1' },
  { date: '2026-03-07', photoUri: 'https://picsum.photos/seed/cal2/100/100', postId: 'post-2' },
  { date: '2026-03-09', photoUri: 'https://picsum.photos/seed/cal3/100/100', postId: 'post-2' },
  { date: '2026-03-12', photoUri: 'https://picsum.photos/seed/cal4/100/100', postId: 'post-1' },
  { date: '2026-03-16', photoUri: 'https://picsum.photos/seed/cal5/100/100', postId: 'post-1' },
  { date: '2026-03-19', photoUri: 'https://picsum.photos/seed/cal6/100/100', postId: 'post-3' },
  { date: '2026-03-22', photoUri: 'https://picsum.photos/seed/cal7/100/100', postId: 'post-1' },
  { date: '2026-03-25', photoUri: 'https://picsum.photos/seed/cal8/100/100', postId: 'post-2' },
  { date: '2026-04-02', photoUri: 'https://picsum.photos/seed/cal9/100/100', postId: 'post-3' },
  { date: '2026-04-05', photoUri: 'https://picsum.photos/seed/cal10/100/100', postId: 'post-1' },
  { date: '2026-04-10', photoUri: 'https://picsum.photos/seed/cal11/100/100', postId: 'post-2' },
];

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 'slide-1',
    eyebrow: 'U:US',
    title: '구별의 저편,\n우리만의 행성으로',
    description: 'Youearth',
  },
];
