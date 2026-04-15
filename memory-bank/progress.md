# Progress

## 완료된 작업

### 2026-04-15 (오늘)

#### 1. `activity_logs` 테이블에 `receiver_id` 컬럼 추가

- **파일**: `supabase_schema.sql`, `scripts/migration_add_receiver_id.sql`
- **브랜치**: `feature/supabase-connect-v3`
- **커밋**: `feat: activity_logs에 receiver_id 컬럼 추가 (알림 기능)`

변경 내용:
- `activity_logs` 테이블에 `receiver_id uuid references auth.users(id) on delete set null` 컬럼 추가
- `receiver_id` 컬럼에 인덱스 추가 (`activity_logs_receiver_id_idx`)
- RLS `activity_select` 정책 수정: `user_id = 나` **또는** `receiver_id = 나` 모두 조회 허용
- Supabase SQL Editor 실행용 마이그레이션 파일 생성 (`scripts/migration_add_receiver_id.sql`)

> **Supabase 적용 필요**: `scripts/migration_add_receiver_id.sql` 내용을 Supabase Dashboard → SQL Editor에서 실행해야 실제 DB에 반영됩니다.

---

#### 2. MyPage 비즈니스 로직 서비스 파일 구현

**수정 파일**: `src/services/profileService.ts`

- `updateProfile(userId, fields)` 함수 추가
  - 수정 가능 필드: `nickname`, `bio`, `avatar_url`
  - RLS에 의해 본인만 수정 가능
  - `updated_at` 자동 갱신

**신규 파일**: `src/services/notificationService.ts`

- `fetchMyNotifications(userId)` — `receiver_id = 나`인 알림 최신순 50건, 발신자 프로필 join 포함
- `fetchNotificationById(notificationId)` — 알림 단건 조회
- `createNotification(params)` — 알림 생성 (좋아요/댓글/그룹참여 시 호출)

**신규 파일**: `src/services/mediaService.ts`

- `fetchMyMedia(userId)` — 내가 올린 미디어 최신순 100건
- `fetchGroupMedia(groupId, limit?)` — 특정 그룹 미디어 목록
- `fetchMediaById(mediaId)` — 미디어 단건 조회
- `fetchMyMediaByType(userId, mediaType)` — 사진/영상 타입별 필터 조회

---

### 이전 작업 (2026-04-15 이전)

- React Native + Expo + TypeScript + Supabase 초기 세팅 완료
- Supabase 전체 스키마 설계 완료 (`supabase_schema.sql`)
- 인증 서비스 구현 (`authService.ts`): 이메일 로그인, 회원가입, OTP 인증, 로그아웃
- 프로필 서비스 초기 구현 (`profileService.ts`): `fetchProfile`, `ensureProfile`
- Supabase client 분리 (`src/lib/supabase.ts`)
- 전체 화면 UI 파일 구성 (`src/screens/`)

---

## 미완료 / 다음 할 일

→ `activeContext.md` 참조
