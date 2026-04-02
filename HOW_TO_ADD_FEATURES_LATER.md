# HOW_TO_ADD_FEATURES_LATER

이 문서는 나중에 기능을 추가할 때 어디를 수정하면 되는지 설명합니다.

## 1. 새 화면 추가

순서:

1. `src/screens`에 새 화면 파일 만들기
2. `app` 아래에 라우트 파일 만들기
3. 필요하면 `src/data/mockData.ts`에 샘플 데이터 추가

## 2. 새 버튼이나 카드 추가

먼저 아래 폴더를 확인하세요.

- `src/components`
- `src/constants/colors.ts`
- `src/constants/tabBar.ts`

## 3. 실제 데이터 연결

지금은 mock 데이터 구조입니다.

나중에 실제 데이터 연결 시 추천 순서:

1. `src/services`에 API 파일 추가
2. `src/context/AppDataProvider.tsx`에서 mock 대신 실제 데이터 공급
3. 화면 파일은 최대한 그대로 사용

## 4. Supabase 연결 시 자주 쓰는 데이터

- 사용자: `profiles`
- 그룹: `groups`
- 그룹 멤버: `group_members`
- 게시글: `posts`
- 댓글: `comments`
- 좋아요: `likes`
- 회고: `recaps`

## 5. Firebase 연결 시 자주 쓰는 데이터

- `users`
- `groups`
- `groupMembers`
- `posts`
- `comments`
- `likes`
- `recaps`

## 6. 어떤 파일부터 수정하면 좋은가

### 화면 디자인만 바꾸고 싶을 때

- `src/screens/*`
- `src/components/*`
- `src/constants/colors.ts`

### 탭 디자인을 바꾸고 싶을 때

- `src/constants/tabBar.ts`
- `app/(tabs)/_layout.tsx`

### 달력/날짜 로직을 바꾸고 싶을 때

- `src/utils/date.ts`
- `src/screens/CalendarTimelineScreen.tsx`

### 데이터 내용만 바꾸고 싶을 때

- `src/data/mockData.ts`

## 7. 초보자 팁

- 화면이 안 나오면 먼저 라우트 파일이 있는지 확인
- 데이터가 안 보이면 `mockData.ts`와 `AppDataProvider.tsx` 확인
- 색이 이상하면 `colors.ts` 확인
- 탭이 이상하면 `tabBar.ts` 확인
