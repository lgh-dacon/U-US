# PROJECT_STRUCTURE

이 문서는 이 프로젝트의 폴더 구조를 초보자 기준으로 설명합니다.

## 전체 구조

```text
mobile-app/
├─ app/
├─ assets/
├─ src/
├─ .gitignore
├─ AGENTS.md
├─ HOW_TO_ADD_FEATURES_LATER.md
├─ HOW_TO_RUN.md
├─ HOW_TO_UPLOAD_TO_GITHUB.md
├─ PROJECT_STRUCTURE.md
├─ README.md
├─ app.json
├─ package.json
├─ package-lock.json
└─ tsconfig.json
```

## app/

`app` 폴더는 Expo Router의 “주소 역할”을 합니다.

- `app/_layout.tsx`
  - 앱 전체 Stack 구조
- `app/index.tsx`
  - 첫 진입 시 어디로 보낼지 결정
- `app/onboarding.tsx`
  - 온보딩 라우트
- `app/login.tsx`
  - 로그인 라우트
- `app/upload.tsx`
  - 업로드 라우트
- `app/(tabs)/`
  - 하단 탭 관련 라우트
- `app/groups/`
  - 그룹 생성/참여/상세 라우트
- `app/posts/`
  - 게시글 상세 라우트
- `app/memories/`
  - 회고 관련 라우트

## src/components/

재사용 가능한 공용 UI입니다.

- `AppScreen.tsx`
  - 화면 공통 배경, 여백, 웹용 모바일 프레임 처리
- `PrimaryButton.tsx`
  - 공용 버튼
- `SectionCard.tsx`
  - 카드 섹션
- `ScreenHeader.tsx`
  - 화면 상단 제목 블록
- `InfoChip.tsx`
  - 짧은 정보 태그

## src/constants/

디자인 설정 파일입니다.

- `colors.ts`
  - 전체 테마 색상
- `tabBar.ts`
  - 하단 탭 아이콘/active/inactive 스타일

## src/context/

- `AppDataProvider.tsx`
  - mock 데이터를 모든 화면에 공급하는 전역 컨텍스트

## src/data/

- `mockData.ts`
  - 현재 앱에서 사용하는 샘플 데이터 전체

## src/screens/

실제 화면 UI 파일입니다.

- `OnboardingScreen.tsx`
- `LoginScreen.tsx`
- `HomeScreen.tsx`
- `FeedScreen.tsx`
- `CalendarTimelineScreen.tsx`
- `GroupCreateScreen.tsx`
- `GroupJoinScreen.tsx`
- `GroupDetailScreen.tsx`
- `UploadScreen.tsx`
- `MapViewScreen.tsx`
- `CalendarViewScreen.tsx`
- `PostDetailScreen.tsx`
- `RecapScreen.tsx`
- `ThenNowScreen.tsx`
- `MyPageScreen.tsx`
- `ScreenPreviewScreen.tsx`

## src/services/

- `dataSource.ts`
  - 나중에 실제 데이터 연결 방향을 설명하는 가이드 파일

## src/types/

- `app.ts`
  - 앱 전체 타입 정의

## src/utils/

- `format.ts`
  - 간단한 문자열 포맷
- `date.ts`
  - 달력과 날짜 처리를 위한 유틸

## 초보자용 추천 읽는 순서

1. `README.md`
2. `PROJECT_STRUCTURE.md`
3. `app/_layout.tsx`
4. `app/(tabs)/_layout.tsx`
5. `src/screens/HomeScreen.tsx`
6. `src/data/mockData.ts`
7. `src/context/AppDataProvider.tsx`
