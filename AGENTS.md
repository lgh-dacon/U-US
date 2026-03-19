# AGENTS

이 문서는 이 프로젝트를 나중에 수정하는 사람이나 AI 도구가 빠르게 이해할 수 있도록 정리한 안내서입니다.

## 프로젝트 목적

- 그룹 기반 Private SNS 모바일 앱
- 추억 기록, 공유, 회고가 핵심
- 현재는 UI와 구조 중심
- 데이터는 mock 기반
- 나중에 Supabase 또는 Firebase 연결 예정

## 기술 스택

- React Native
- Expo
- TypeScript
- Expo Router

## 현재 구조 원칙

- 구조는 단순하게 유지
- 과도한 추상화 금지
- 화면 파일은 `src/screens`
- 라우트 파일은 `app`
- mock 데이터는 `src/data/mockData.ts`
- 실제 데이터 연결 지점은 `src/services`와 `src/context/AppDataProvider.tsx`

## 수정할 때 지켜야 할 점

- 초보자가 읽기 쉬운 이름 유지
- 너무 복잡한 커스텀 훅이나 추상화는 피하기
- 공용 스타일은 `src/components`, `src/constants` 우선 사용
- 새 기능 추가 시 mock 데이터도 함께 추가
- 주요 파일 상단에는 역할 설명 주석 유지

## 핵심 파일

- `app/_layout.tsx`
- `app/(tabs)/_layout.tsx`
- `src/screens/*`
- `src/data/mockData.ts`
- `src/context/AppDataProvider.tsx`
- `src/constants/colors.ts`
- `src/constants/tabBar.ts`

## 실제 데이터 연결 힌트

- mock 데이터를 바로 지우기보다 provider만 교체
- `posts.createdAt`, `posts.groupId`, `posts.title` 같은 필드는 현재 UI와 직접 연결됨
- 달력 기반 기록 화면은 `createdAt` 기준 그룹핑으로 동작

## GitHub 업로드 전 확인

- `node_modules`, `.expo`, `dist`는 제외
- 문서 파일 포함
- README 최신 상태 확인
