-- =============================================
-- U:US 앱 Supabase DB 스키마
-- Supabase Dashboard > SQL Editor 에서 실행하세요
-- =============================================

-- 1. 사용자 프로필
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null default '',
  avatar_url text,
  bio text default '',
  role_label text default '멤버',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. 사용자 설정 (공유 범위, 공유 수준 등)
create table public.user_preferences (
  id uuid primary key references auth.users(id) on delete cascade,
  share_scope text not null default 'group',       -- 'group' | 'public' | 'private'
  share_level text not null default 'standard',    -- 'standard' | 'limited' | 'full'
  guest_flag boolean not null default false,
  updated_at timestamptz not null default now()
);

-- 3. 그룹 (행성)
create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  cover_image_url text,
  planet_color text default '#7B61FF',
  planet_size int default 100,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. 그룹 멤버
create table public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',  -- 'owner' | 'admin' | 'member'
  joined_at timestamptz not null default now(),
  unique(group_id, user_id)
);

-- 5. 초대
create table public.invites (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  invited_by uuid not null references auth.users(id) on delete cascade,
  invite_code text not null unique,
  expires_at timestamptz,
  is_used boolean not null default false,
  created_at timestamptz not null default now()
);

-- 6. 게시물
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  title text default '',
  body text default '',
  location_name text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. 미디어 (사진/영상, Post에 연결)
create table public.media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  uploader_id uuid not null references auth.users(id) on delete cascade,
  media_type text not null default 'photo',  -- 'photo' | 'video'
  url text not null,
  thumbnail_url text,
  caption text default '',
  metadata jsonb default '{}',               -- EXIF, 태그 등
  created_at timestamptz not null default now()
);

-- 8. 댓글
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- 9. 좋아요
create table public.likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(post_id, user_id)
);

-- 10. 저장 항목 (외부 저장 또는 개인 저장)
create table public.saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  media_id uuid references public.media(id) on delete cascade,
  export_flag boolean not null default false,
  created_at timestamptz not null default now()
);

-- 11. 활동 내역
create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  receiver_id uuid references auth.users(id) on delete set null, -- 알림 수신자 (like→게시물 작성자, comment→게시물 작성자 등)
  action text not null,        -- 'post_created' | 'comment' | 'like' | 'join_group' | 'upload' 등
  target_type text,            -- 'post' | 'media' | 'group' | 'comment'
  target_id uuid,
  created_at timestamptz not null default now()
);

-- 12. 공유 로그 (타 SNS 공유)
create table public.share_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid references public.posts(id) on delete set null,
  platform text not null,      -- 'kakao' | 'instagram' | 'twitter' 등
  created_at timestamptz not null default now()
);

-- 13. 회고 콘텐츠 (Nostalgia News)
create table public.recaps (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  period text not null default 'weekly',  -- 'weekly' | 'monthly'
  title text not null,
  summary text default '',
  highlight text default '',
  emotion_keyword text default '',
  cover_image_url text,
  target_date date not null,
  created_at timestamptz not null default now()
);

-- 14. 캘린더 인덱스 (날짜별 추억 연결)
create table public.calendar_index (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  date date not null,
  post_id uuid references public.posts(id) on delete cascade,
  media_url text,
  created_at timestamptz not null default now(),
  unique(group_id, date, post_id)
);

-- =============================================
-- Row Level Security (RLS) 활성화
-- =============================================
alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.invites enable row level security;
alter table public.posts enable row level security;
alter table public.media enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.saved_items enable row level security;
alter table public.activity_logs enable row level security;
alter table public.share_logs enable row level security;
alter table public.recaps enable row level security;
alter table public.calendar_index enable row level security;

-- =============================================
-- 기본 RLS 정책 (로그인 사용자 기준)
-- =============================================

-- profiles: 본인 조회/수정, 같은 그룹원 조회 가능
create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);

-- user_preferences: 본인만
create policy "prefs_select" on public.user_preferences for select using (auth.uid() = id);
create policy "prefs_update" on public.user_preferences for update using (auth.uid() = id);
create policy "prefs_insert" on public.user_preferences for insert with check (auth.uid() = id);

-- groups: 멤버만 조회, 로그인 유저 생성 가능
create policy "groups_select" on public.groups for select using (
  exists (select 1 from public.group_members where group_id = groups.id and user_id = auth.uid())
);
create policy "groups_insert" on public.groups for insert with check (auth.uid() = created_by);
create policy "groups_update" on public.groups for update using (
  exists (select 1 from public.group_members where group_id = groups.id and user_id = auth.uid() and role in ('owner', 'admin'))
);

-- group_members: 같은 그룹 멤버만 조회
create policy "gm_select" on public.group_members for select using (
  exists (select 1 from public.group_members gm where gm.group_id = group_members.group_id and gm.user_id = auth.uid())
);
create policy "gm_insert" on public.group_members for insert with check (auth.uid() = user_id or
  exists (select 1 from public.group_members where group_id = group_members.group_id and user_id = auth.uid() and role in ('owner', 'admin'))
);
create policy "gm_delete" on public.group_members for delete using (
  auth.uid() = user_id or
  exists (select 1 from public.group_members gm where gm.group_id = group_members.group_id and gm.user_id = auth.uid() and gm.role in ('owner', 'admin'))
);

-- invites: 그룹 멤버가 조회, owner/admin이 생성
create policy "invites_select" on public.invites for select using (true);
create policy "invites_insert" on public.invites for insert with check (
  exists (select 1 from public.group_members where group_id = invites.group_id and user_id = auth.uid())
);

-- posts: 그룹 멤버만 조회/생성
create policy "posts_select" on public.posts for select using (
  exists (select 1 from public.group_members where group_id = posts.group_id and user_id = auth.uid())
);
create policy "posts_insert" on public.posts for insert with check (
  exists (select 1 from public.group_members where group_id = posts.group_id and user_id = auth.uid())
);
create policy "posts_update" on public.posts for update using (auth.uid() = author_id);
create policy "posts_delete" on public.posts for delete using (
  auth.uid() = author_id or
  exists (select 1 from public.group_members where group_id = posts.group_id and user_id = auth.uid() and role in ('owner', 'admin'))
);

-- media: 그룹 멤버만
create policy "media_select" on public.media for select using (
  exists (select 1 from public.group_members where group_id = media.group_id and user_id = auth.uid())
);
create policy "media_insert" on public.media for insert with check (
  exists (select 1 from public.group_members where group_id = media.group_id and user_id = auth.uid())
);
create policy "media_update" on public.media for update using (auth.uid() = uploader_id);
create policy "media_delete" on public.media for delete using (
  auth.uid() = uploader_id or
  exists (select 1 from public.group_members where group_id = media.group_id and user_id = auth.uid() and role in ('owner', 'admin'))
);

-- comments: 그룹 멤버만
create policy "comments_select" on public.comments for select using (
  exists (
    select 1 from public.posts p
    join public.group_members gm on gm.group_id = p.group_id
    where p.id = comments.post_id and gm.user_id = auth.uid()
  )
);
create policy "comments_insert" on public.comments for insert with check (auth.uid() = author_id);
create policy "comments_delete" on public.comments for delete using (auth.uid() = author_id);

-- likes: 그룹 멤버만
create policy "likes_select" on public.likes for select using (
  exists (
    select 1 from public.posts p
    join public.group_members gm on gm.group_id = p.group_id
    where p.id = likes.post_id and gm.user_id = auth.uid()
  )
);
create policy "likes_insert" on public.likes for insert with check (auth.uid() = user_id);
create policy "likes_delete" on public.likes for delete using (auth.uid() = user_id);

-- saved_items: 본인만
create policy "saved_select" on public.saved_items for select using (auth.uid() = user_id);
create policy "saved_insert" on public.saved_items for insert with check (auth.uid() = user_id);
create policy "saved_delete" on public.saved_items for delete using (auth.uid() = user_id);

-- activity_logs: 행동한 본인 또는 알림 수신자 조회 가능, 삽입은 행동한 본인만
create policy "activity_select" on public.activity_logs for select using (
  auth.uid() = user_id or auth.uid() = receiver_id
);
create policy "activity_insert" on public.activity_logs for insert with check (auth.uid() = user_id);

-- share_logs: 본인만
create policy "share_select" on public.share_logs for select using (auth.uid() = user_id);
create policy "share_insert" on public.share_logs for insert with check (auth.uid() = user_id);

-- recaps: 그룹 멤버만
create policy "recaps_select" on public.recaps for select using (
  exists (select 1 from public.group_members where group_id = recaps.group_id and user_id = auth.uid())
);
create policy "recaps_insert" on public.recaps for insert with check (
  exists (select 1 from public.group_members where group_id = recaps.group_id and user_id = auth.uid())
);

-- calendar_index: 그룹 멤버만
create policy "calendar_select" on public.calendar_index for select using (
  exists (select 1 from public.group_members where group_id = calendar_index.group_id and user_id = auth.uid())
);
create policy "calendar_insert" on public.calendar_index for insert with check (
  exists (select 1 from public.group_members where group_id = calendar_index.group_id and user_id = auth.uid())
);

-- =============================================
-- 회원가입 시 자동 프로필 생성 트리거
-- =============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', '유저_' || substr(new.id::text, 1, 4)));

  insert into public.user_preferences (id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
