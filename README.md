<<<<<<< HEAD

# Memory Group App

추억을 함께 기록하고 다시 돌아보는 그룹 기반 Private SNS 모바일 앱 프로젝트입니다.

이 프로젝트는 `React Native + Expo + TypeScript`로 만들어졌습니다.  
지금 단계에서는 실제 서버 연결보다 `화면 구조`, `탐색 흐름`, `mock 데이터 구조`를 먼저 이해하기 쉽게 만드는 데 집중했습니다.

## 핵심 요약

- 모바일 앱 프로젝트입니다.
- 웹 미리보기는 확인용입니다.
- 데이터는 아직 mock 기반입니다.
- 나중에 Supabase 또는 Firebase로 연결하기 쉽게 구조를 분리해 두었습니다.
- 초보자도 파일 역할을 보고 따라갈 수 있도록 주요 파일 상단에 설명 주석을 넣었습니다.

## 빠른 실행

```bash
npm install
npm run start
```

웹 미리보기가 필요하면:

```bash
npm run web
```

## 가장 먼저 보면 좋은 파일

- [app/_layout.tsx](C:\Users\82109\OneDrive - 데이콘\바탕 화면\work\mobile-app\app_layout.tsx)
- [src/screens/HomeScreen.tsx](C:\Users\82109\OneDrive - 데이콘\바탕 화면\work\mobile-app\src\screens\HomeScreen.tsx)
- [src/data/mockData.ts](C:\Users\82109\OneDrive - 데이콘\바탕 화면\work\mobile-app\src\data\mockData.ts)
- [src/context/AppDataProvider.tsx](C:\Users\82109\OneDrive - 데이콘\바탕 화면\work\mobile-app\src\context\AppDataProvider.tsx)
- [src/constants/colors.ts](C:\Users\82109\OneDrive - 데이콘\바탕 화면\work\mobile-app\src\constants\colors.ts)
- [src/constants/tabBar.ts](C:\Users\82109\OneDrive - 데이콘\바탕 화면\work\mobile-app\src\constants\tabBar.ts)

## 폴더 구조 한눈에 보기

자세한 설명은 [PROJECT_STRUCTURE.md](C:\Users\82109\OneDrive - 데이콘\바탕 화면\work\mobile-app\PROJECT_STRUCTURE.md)에 정리했습니다.

```text
app/             Expo Router 경로 파일
src/components/  공용 UI 조각
src/constants/   색상, 탭 디자인 설정
src/context/     전역 mock 데이터 공급
src/data/        mock 데이터
src/screens/     실제 화면 UI
src/services/    나중에 실제 데이터 연결할 위치
src/types/       타입 정의
src/utils/       간단한 유틸 함수
```

## mock 데이터와 실제 데이터 연결 위치

- mock 데이터 위치: [mockData.ts](C:\Users\82109\OneDrive - 데이콘\바탕 화면\work\mobile-app\src\data\mockData.ts)
- 전역 공급 위치: [AppDataProvider.tsx](C:\Users\82109\OneDrive - 데이콘\바탕 화면\work\mobile-app\src\context\AppDataProvider.tsx)
- 실제 데이터 연결 가이드: [dataSource.ts](C:\Users\82109\OneDrive - 데이콘\바탕 화면\work\mobile-app\src\services\dataSource.ts)

나중에 Supabase 또는 Firebase를 붙일 때는:

1. `src/services`에 실제 API 파일 추가
2. `src/context/AppDataProvider.tsx`에서 mock 대신 실제 데이터를 공급
3. `src/screens`는 최대한 그대로 유지

## GitHub에 처음 올릴 때 핵심 파일

다음 파일과 폴더가 특히 중요합니다.

- `app/`
- `src/`
- `assets/`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `app.json`
- `.gitignore`
- `README.md`
- `PROJECT_STRUCTURE.md`
- `HOW_TO_RUN.md`
- `HOW_TO_UPLOAD_TO_GITHUB.md`
- `HOW_TO_ADD_FEATURES_LATER.md`
- `AGENTS.md`

반대로 `node_modules/`, `.expo/`, `dist/`는 GitHub에 올리지 않습니다.

## 추가 문서

- 실행 방법: [HOW_TO_RUN.md](C:\Users\82109\OneDrive - 데이콘\바탕 화면\work\mobile-app\HOW_TO_RUN.md)
- GitHub 업로드 방법: [HOW_TO_UPLOAD_TO_GITHUB.md](C:\Users\82109\OneDrive - 데이콘\바탕 화면\work\mobile-app\HOW_TO_UPLOAD_TO_GITHUB.md)
- 기능 추가 방법: [HOW_TO_ADD_FEATURES_LATER.md](C:\Users\82109\OneDrive - 데이콘\바탕 화면\work\mobile-app\HOW_TO_ADD_FEATURES_LATER.md)
- # 협업 안내: [AGENTS.md](C:\Users\82109\OneDrive - 데이콘\바탕 화면\work\mobile-app\AGENTS.md)

# U-US

U:US 개발 코드
