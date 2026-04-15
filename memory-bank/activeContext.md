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
| `src/services/groupService.ts` | 그룹 생성/조회/참여/탈퇴/초대 | 완료 |
| `src/services/postService.ts` | 피드/게시물 CRUD | 완료 |
| `src/services/uploadService.ts` | Storage 업로드/삭제 | 완료 |
| `src/services/likeService.ts` | 좋아요 토글/조회 | 완료 |
| `src/services/commentService.ts` | 댓글 작성/조회/삭제 | 완료 |

---

## 다음 할 일 (우선순위 순)

### 1. Supabase DB 마이그레이션 실행 (즉시 필요, 미완료)
- `scripts/migration_add_receiver_id.sql` 내용을 **Supabase Dashboard → SQL Editor**에서 실행
- 실행 전까지 `notificationService.ts`의 `receiver_id` 관련 기능이 동작하지 않음

### 2. MyPageScreen.tsx 화면 연동
- 현재 `MyPageScreen.tsx`는 mock 데이터 기반
- 구현된 서비스 함수로 실제 데이터 연결 필요
  - `fetchProfile(userId)` → 프로필 표시
  - `updateProfile(userId, fields)` → 닉네임/소개 수정 UI
  - `fetchMyMedia(userId)` → 내 미디어 그리드 표시
  - `fetchMyNotifications(userId)` → 알림 목록 표시

### 3. Supabase RLS 재귀 버그 수정 (즉시 필요)
- `scripts/fix-rls-recursion.sql` 을 Supabase SQL Editor에서 실행
- 실행 전까지 그룹/게시물 관련 기능 동작 불가

### 4. Supabase Storage 버킷 생성
- Dashboard > Storage > New bucket > 이름: `media`, Public 버킷으로 생성
- `uploadService.ts` 동작을 위한 전제 조건

### 5. 화면 실제 연동 (서비스 → 화면 교체)
- `HomeScreen`, `FeedScreen` → `postService`, `groupService`
- `GroupCreateScreen`, `GroupJoinScreen` → `groupService`
- `UploadScreen` → `uploadService`
- `PostDetailScreen` → `likeService`, `commentService`
- `MyPageScreen` → `profileService`, `mediaService`, `notificationService`

---

## 아키텍처 메모

- 서비스 파일은 모두 `src/lib/supabase.ts` 의 `supabase` 객체를 import해서 씁니다.
- 화면(screen)은 서비스 함수만 호출하고, Supabase 직접 호출은 하지 않습니다.
- RLS가 활성화되어 있으므로 인증된 유저만 데이터에 접근 가능합니다.
- 알림 생성은 각 서비스(like, comment, group join) 내에서 `createNotification()`을 직접 호출하는 방식으로 설계합니다 (별도 트리거 없음).
