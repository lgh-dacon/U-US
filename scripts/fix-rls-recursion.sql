-- =============================================
-- RLS 무한 재귀 버그 수정
-- 실행 위치: Supabase Dashboard > SQL Editor
-- 작성일: 2026-04-15
--
-- 문제 원인:
--   group_members SELECT 정책이 "같은 그룹의 멤버인지"를 확인하기 위해
--   group_members 테이블을 다시 조회합니다.
--   이때 RLS가 또다시 같은 정책을 실행 → 무한 재귀가 발생합니다.
--
-- 해결 방법:
--   security definer 함수를 만들어서 RLS를 우회한 채 멤버 여부를 확인합니다.
--   이 함수는 RLS 정책 안에서만 호출되며, 내부적으로는 RLS 없이 실행됩니다.
-- =============================================

-- ① 내가 속한 그룹 ID 목록을 반환하는 헬퍼 함수 생성
--    security definer: RLS를 우회해서 실행됩니다 (무한 재귀 방지)
--    stable: 같은 트랜잭션 내에서 결과가 바뀌지 않음을 선언해 성능을 높입니다
create or replace function public.get_my_group_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select group_id
  from public.group_members
  where user_id = auth.uid()
$$;

-- ② 기존 group_members 재귀 정책 교체
drop policy if exists "gm_select" on public.group_members;

create policy "gm_select" on public.group_members
  for select using (
    -- 내가 속한 그룹의 멤버 목록만 볼 수 있습니다.
    -- get_my_group_ids()는 RLS 없이 실행되므로 재귀가 발생하지 않습니다.
    group_id in (select public.get_my_group_ids())
  );

-- ③ groups SELECT 정책도 같은 함수로 교체 (동일한 재귀 위험 존재)
drop policy if exists "groups_select" on public.groups;

create policy "groups_select" on public.groups
  for select using (
    id in (select public.get_my_group_ids())
  );

-- ④ groups UPDATE 정책도 교체
drop policy if exists "groups_update" on public.groups;

create policy "groups_update" on public.groups
  for update using (
    exists (
      select 1
      from public.group_members
      where group_id = groups.id
        and user_id = auth.uid()
        and role in ('owner', 'admin')
    )
  );

-- ⑤ posts, media, comments, likes, recaps, calendar_index 정책도 교체
--    (group_members를 직접 참조하므로 동일하게 함수로 대체)

drop policy if exists "posts_select" on public.posts;
create policy "posts_select" on public.posts
  for select using (group_id in (select public.get_my_group_ids()));

drop policy if exists "posts_insert" on public.posts;
create policy "posts_insert" on public.posts
  for insert with check (group_id in (select public.get_my_group_ids()));

drop policy if exists "media_select" on public.media;
create policy "media_select" on public.media
  for select using (group_id in (select public.get_my_group_ids()));

drop policy if exists "media_insert" on public.media;
create policy "media_insert" on public.media
  for insert with check (group_id in (select public.get_my_group_ids()));

drop policy if exists "recaps_select" on public.recaps;
create policy "recaps_select" on public.recaps
  for select using (group_id in (select public.get_my_group_ids()));

drop policy if exists "recaps_insert" on public.recaps;
create policy "recaps_insert" on public.recaps
  for insert with check (group_id in (select public.get_my_group_ids()));

drop policy if exists "calendar_select" on public.calendar_index;
create policy "calendar_select" on public.calendar_index
  for select using (group_id in (select public.get_my_group_ids()));

drop policy if exists "calendar_insert" on public.calendar_index;
create policy "calendar_insert" on public.calendar_index
  for insert with check (group_id in (select public.get_my_group_ids()));
