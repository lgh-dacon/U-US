# HOW_TO_RUN

이 문서는 프로젝트를 처음 실행하는 방법을 정리한 문서입니다.

## 1. 필요한 것

- Node.js
- npm

## 2. 설치

프로젝트 폴더에서 아래 명령을 실행합니다.

```bash
npm install
```

## 3. 모바일 앱 개발 서버 실행

```bash
npm run start
```

실행 후 Expo에서 QR 코드 또는 로컬 주소를 확인할 수 있습니다.

## 4. 웹 미리보기 실행

```bash
npm run web
```

## 5. 자주 쓰는 명령어

```bash
npm run start
npm run android
npm run ios
npm run web
npm run typecheck
```

## 6. 문제가 생기면 먼저 확인할 것

- `node_modules`가 없으면 `npm install`부터 다시 실행
- Expo 캐시 문제 같으면 서버를 끄고 다시 실행
- OneDrive 경로에서 문제 생기면 일반 로컬 경로로 옮겨 실행

## 7. 초보자 팁

- `app`은 화면 주소 연결
- `src/screens`는 실제 화면
- `src/data/mockData.ts`는 샘플 데이터
- 화면 내용만 바꾸고 싶으면 `src/screens`와 `src/data`를 먼저 보면 됩니다
