-- =============================================
-- Migration: activity_logs에 receiver_id 컬럼 추가
-- 실행 위치: Supabase Dashboard > SQL Editor
-- 작성일: 2026-04-15
-- =============================================

-- ① 컬럼 추가
--    기존 데이터는 receiver_id = NULL 로 유지됨 (nullable)
alter table public.activity_logs
  add column if not exists receiver_id uuid references auth.users(id) on delete set null;

-- ② 인덱스 추가 (receiver_id 기준 알림 목록 조회 성능)
create index if not exists activity_logs_receiver_id_idx
  on public.activity_logs (receiver_id);

-- ③ 기존 RLS 정책 삭제 후 재생성
drop policy if exists "activity_select" on public.activity_logs;
drop policy if exists "activity_insert" on public.activity_logs;

-- SELECT: 내가 행동한 로그 OR 나에게 온 알림 모두 조회 가능
create policy "activity_select" on public.activity_logs
  for select using (
    auth.uid() = user_id
    or auth.uid() = receiver_id
  );

-- INSERT: 행동한 본인만 삽입 가능
create policy "activity_insert" on public.activity_logs
  for insert with check (auth.uid() = user_id);
