# Active Context

## 현재 브랜치

`feature/supabase-connect-v3`

## 현재 작업 상태 (2026-04-15 기준)

MyPage 비즈니스 로직 서비스 파일 구현 완료.
`src/services/` 폴더 기준 Supabase 연동 서비스 파일이 갖춰진 상태.

### 완성된 서비스 파일 목록

| 파일 | 역할 | 상태 |
|---|---|---|
| `src/lib/supabase.ts` | Supabase client | 완료 |
| `src/services/authService.ts` | 로그인/회원가입/OTP/로그아웃 | 완료 |
| `src/services/profileService.ts` | 프로필 조회/생성/수정 | 완료 |
| `src/services/notificationService.ts` | 알림 조회/생성 | 완료 |
| `src/services/mediaService.ts` | 미디어 조회 | 완료 |

---

## 다음 할 일 (우선순위 순)

### 1. Supabase DB 마이그레이션 실행 (즉시 필요)
- `scripts/migration_add_receiver_id.sql` 내용을 **Supabase Dashboard → SQL Editor**에서 실행
- 실행 전까지 `notificationService.ts`의 `receiver_id` 관련 기능이 동작하지 않음

### 2. MyPageScreen.tsx 화면 연동
- 현재 `MyPageScreen.tsx`는 mock 데이터 기반
- 구현된 서비스 함수로 실제 데이터 연결 필요
  - `fetchProfile(userId)` → 프로필 표시
  - `updateProfile(userId, fields)` → 닉네임/소개 수정 UI
  - `fetchMyMedia(userId)` → 내 미디어 그리드 표시
  - `fetchMyNotifications(userId)` → 알림 목록 표시

### 3. 좋아요 / 댓글 기능 서비스 파일 구현
- `likeService.ts`: 좋아요 추가/취소 + `createNotification` 연동
- `commentService.ts`: 댓글 작성/삭제 + `createNotification` 연동
- 서비스 함수 내에서 알림을 자동 생성하는 흐름

### 4. 그룹 관련 서비스 파일 구현
- `groupService.ts`: 그룹 목록 조회, 그룹 생성, 멤버 추가/삭제
- `inviteService.ts`: 초대 코드 생성, 초대 코드로 그룹 참여

### 5. 피드 서비스 파일 구현
- `postService.ts`: 게시물 CRUD, 피드 목록 조회 (그룹 멤버 기준)

---

## 아키텍처 메모

- 서비스 파일은 모두 `src/lib/supabase.ts` 의 `supabase` 객체를 import해서 씁니다.
- 화면(screen)은 서비스 함수만 호출하고, Supabase 직접 호출은 하지 않습니다.
- RLS가 활성화되어 있으므로 인증된 유저만 데이터에 접근 가능합니다.
- 알림 생성은 각 서비스(like, comment, group join) 내에서 `createNotification()`을 직접 호출하는 방식으로 설계합니다 (별도 트리거 없음).
