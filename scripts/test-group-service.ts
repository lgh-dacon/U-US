/**
 * 역할: groupService.ts의 핵심 기능을 Supabase 실서버에 직접 실행해 검증하는 테스트 스크립트입니다.
 *
 * 실행 방법:
 *   npm run test:group
 *
 * 실행하면 이메일과 비밀번호를 터미널에서 직접 입력받습니다.
 *
 * 주의:
 *   - 이 스크립트를 실행하면 Supabase에 실제 데이터가 생성됩니다.
 *   - 테스트 종료 후 자동으로 생성된 데이터를 삭제(정리)합니다.
 *   - RLS 정책이 활성화되어 있으므로 반드시 로그인 후 실행됩니다.
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────
// 환경변수 로드 (.env 파일을 직접 파싱합니다)
// ─────────────────────────────────────────────

/**
 * .env 파일을 읽어서 process.env에 등록합니다.
 * dotenv 패키지 없이 직접 파싱하는 방식입니다.
 */
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env 파일을 찾을 수 없습니다. 프로젝트 루트에 .env 파일이 있는지 확인하세요.');
    process.exit(1);
  }

  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    // 주석(#)과 빈 줄은 건너뜁니다.
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex < 0) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnv();

// ─────────────────────────────────────────────
// 커맨드라인 인자에서 이메일 / 비밀번호 읽기
// ─────────────────────────────────────────────
// 실행 방법:
//   npm run test:group -- 이메일 비밀번호
// 예시:
//   npm run test:group -- test@example.com mypassword

const [,, argEmail, argPassword] = process.argv;

// ─────────────────────────────────────────────
// Supabase 클라이언트 초기화
// ─────────────────────────────────────────────

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Supabase 환경변수가 없습니다. .env 파일을 확인하세요.');
  process.exit(1);
}

/**
 * 이 스크립트 전용 Supabase 클라이언트입니다.
 * 앱의 src/lib/supabase.ts와 별개로 만들었습니다.
 * (scripts 폴더는 Expo 환경 밖에서 실행되므로 독립적으로 구성합니다.)
 */
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─────────────────────────────────────────────
// 콘솔 출력 유틸
// ─────────────────────────────────────────────

/** 구분선 출력 */
function divider(label?: string) {
  if (label) {
    console.log(`\n${'─'.repeat(20)} ${label} ${'─'.repeat(20)}`);
  } else {
    console.log('─'.repeat(50));
  }
}

/** 성공 메시지 */
function pass(msg: string) {
  console.log(`  ✅ ${msg}`);
}

/** 실패 메시지 */
function fail(msg: string, detail?: unknown) {
  console.error(`  ❌ ${msg}`);
  if (detail) console.error('     상세:', detail);
}

/** 정보 메시지 */
function info(msg: string) {
  console.log(`  ℹ️  ${msg}`);
}

// ─────────────────────────────────────────────
// 정리용 상태 추적 (테스트 후 생성된 데이터 삭제)
// ─────────────────────────────────────────────

/** 테스트 중 생성된 그룹 ID 목록 (정리 시 삭제) */
const createdGroupIds: string[] = [];

// ─────────────────────────────────────────────
// groupService 로직 (src/services/groupService.ts 와 동일)
// ─────────────────────────────────────────────
// 스크립트는 Expo 모듈 해석 환경 밖에서 실행되므로
// 서비스 파일을 직접 import하는 대신 핵심 로직을 여기서 재현합니다.

function makeInviteCode(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('');
}

// ─────────────────────────────────────────────
// 테스트 1: 그룹 생성
// ─────────────────────────────────────────────

async function testCreateGroup(userId: string): Promise<string | null> {
  divider('테스트 1: 그룹 생성');

  const groupName = `테스트_그룹_${Date.now()}`;
  info(`생성할 그룹 이름: "${groupName}"`);

  // ① groups 테이블에 INSERT
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .insert({
      name: groupName,
      description: '자동화 테스트로 생성된 그룹입니다.',
      planet_color: '#7B61FF',
      planet_size: 100,
      created_by: userId,
    })
    .select('id, name, planet_color, created_by')
    .single();

  if (groupError || !group) {
    fail('그룹 생성 실패', groupError?.message);
    return null;
  }

  pass(`그룹 생성 성공 → id: ${group.id}`);
  info(`그룹명: ${group.name}, 색상: ${group.planet_color}`);

  // ② group_members에 owner 등록
  const { error: memberError } = await supabase
    .from('group_members')
    .insert({
      group_id: group.id,
      user_id: userId,
      role: 'owner',
    });

  if (memberError) {
    fail('owner 멤버 등록 실패', memberError?.message);
    return null;
  }

  pass(`owner 멤버 등록 성공 → user_id: ${userId}`);

  // 정리 목록에 추가
  createdGroupIds.push(group.id);

  return group.id;
}

// ─────────────────────────────────────────────
// 테스트 2: 초대 코드 발급
// ─────────────────────────────────────────────

async function testGenerateInviteCode(userId: string, groupId: string): Promise<string | null> {
  divider('테스트 2: 초대 코드 발급');

  const code = makeInviteCode();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  info(`생성할 초대 코드: "${code}"`);
  info(`만료 시각: ${expiresAt}`);

  const { data: invite, error } = await supabase
    .from('invites')
    .insert({
      group_id: groupId,
      invited_by: userId,
      invite_code: code,
      expires_at: expiresAt,
      is_used: false,
    })
    .select('id, invite_code, expires_at, is_used')
    .single();

  if (error || !invite) {
    fail('초대 코드 발급 실패', error?.message);
    return null;
  }

  pass(`초대 코드 발급 성공 → code: "${invite.invite_code}"`);
  info(`is_used: ${invite.is_used} (미사용 상태 확인)`);
  info(`만료: ${invite.expires_at}`);

  // 발급된 코드로 다시 조회해 DB에 실제로 저장됐는지 확인합니다.
  const { data: fetched } = await supabase
    .from('invites')
    .select('invite_code')
    .eq('invite_code', code)
    .maybeSingle();

  if (fetched?.invite_code === code) {
    pass(`DB 저장 확인 완료 → invites 테이블에 코드 존재`);
  } else {
    fail('DB 저장 확인 실패 → invites 테이블에서 코드를 찾을 수 없습니다');
  }

  return code;
}

// ─────────────────────────────────────────────
// 테스트 3: 내 그룹 목록 조회
// ─────────────────────────────────────────────

async function testFetchMyGroups(userId: string, expectedGroupId: string) {
  divider('테스트 3: 내 그룹 목록 조회');

  const { data, error } = await supabase
    .from('group_members')
    .select(`
      role,
      joined_at,
      group:groups (
        id,
        name,
        planet_color,
        planet_size
      )
    `)
    .eq('user_id', userId)
    .order('joined_at', { ascending: false });

  if (error) {
    fail('그룹 목록 조회 실패', error.message);
    return;
  }

  if (!data || data.length === 0) {
    fail('그룹 목록이 비어있습니다. (테스트 1이 성공했다면 최소 1개여야 합니다.)');
    return;
  }

  pass(`그룹 목록 조회 성공 → 총 ${data.length}개 그룹`);

  // 방금 생성한 그룹이 목록에 있는지 확인합니다.
  type GroupShape = { id: string; name: string; planet_color: string };
  const found = data.find((row) => {
    const g = (row.group as unknown) as GroupShape | null;
    return g?.id === expectedGroupId;
  });

  if (found) {
    const g = (found.group as unknown) as GroupShape | null;
    pass(`테스트 그룹 확인 완료 → "${g?.name}" (role: ${found.role})`);
  } else {
    fail(`테스트 그룹(${expectedGroupId})이 목록에 없습니다.`);
  }

  // 조회된 그룹 목록 전체 출력
  info('─ 전체 그룹 목록:');
  data.forEach((row, i) => {
    const g = (row.group as unknown) as { id: string; name: string } | null;
    if (g) {
      console.log(`     ${i + 1}. "${g.name}" (role: ${row.role})`);
    }
  });
}

// ─────────────────────────────────────────────
// 테스트 4: 멤버 목록 조회
// ─────────────────────────────────────────────

async function testFetchGroupMembers(groupId: string, expectedUserId: string) {
  divider('테스트 4: 멤버 목록 조회');

  const { data, error } = await supabase
    .from('group_members')
    .select(`
      id,
      user_id,
      role,
      joined_at,
      profile:profiles (
        nickname,
        avatar_url,
        role_label
      )
    `)
    .eq('group_id', groupId)
    .order('joined_at', { ascending: true });

  if (error) {
    fail('멤버 목록 조회 실패', error.message);
    return;
  }

  if (!data || data.length === 0) {
    fail('멤버가 없습니다. (그룹 생성 시 owner가 자동 추가됐어야 합니다.)');
    return;
  }

  pass(`멤버 목록 조회 성공 → 총 ${data.length}명`);

  type ProfileShape = { nickname: string };

  // owner가 있는지 확인합니다.
  const owner = data.find((m) => m.role === 'owner');
  if (owner) {
    const profile = (owner.profile as unknown) as ProfileShape | null;
    pass(`owner 확인 완료 → user_id: ${owner.user_id}, 닉네임: "${profile?.nickname ?? '(없음)'}"`);
  } else {
    fail('owner 역할 멤버가 없습니다.');
  }

  // 내 계정(expectedUserId)이 멤버에 있는지 확인합니다.
  const me = data.find((m) => m.user_id === expectedUserId);
  if (me) {
    pass(`내 계정 멤버 확인 완료 → role: "${me.role}"`);
  } else {
    fail(`내 계정(${expectedUserId})이 멤버 목록에 없습니다.`);
  }

  // 멤버 전체 출력
  info('─ 전체 멤버 목록:');
  data.forEach((m, i) => {
    const profile = (m.profile as unknown) as ProfileShape | null;
    console.log(`     ${i + 1}. ${profile?.nickname ?? '(닉네임 없음)'} (role: ${m.role}, joined: ${m.joined_at.slice(0, 10)})`);
  });
}

// ─────────────────────────────────────────────
// 정리: 테스트 데이터 삭제
// ─────────────────────────────────────────────

async function cleanup() {
  divider('정리: 테스트 데이터 삭제');

  if (createdGroupIds.length === 0) {
    info('삭제할 테스트 데이터가 없습니다.');
    return;
  }

  for (const groupId of createdGroupIds) {
    // invites 삭제 (group_id 기준 cascade가 없으므로 명시적으로 삭제)
    await supabase.from('invites').delete().eq('group_id', groupId);

    // group_members 삭제
    await supabase.from('group_members').delete().eq('group_id', groupId);

    // groups 삭제
    const { error } = await supabase.from('groups').delete().eq('id', groupId);

    if (error) {
      fail(`그룹(${groupId}) 삭제 실패`, error.message);
    } else {
      pass(`그룹(${groupId}) 및 관련 데이터 삭제 완료`);
    }
  }
}

// ─────────────────────────────────────────────
// 메인 실행
// ─────────────────────────────────────────────

async function main() {
  console.log('\n' + '═'.repeat(50));
  console.log('  groupService.ts 통합 테스트');
  console.log('  대상 Supabase:', SUPABASE_URL);
  console.log('═'.repeat(50));

  // ── 테스트 계정 확인 ──
  const TEST_EMAIL = argEmail;
  const TEST_PASSWORD = argPassword;

  if (!TEST_EMAIL || !TEST_PASSWORD) {
    console.error('\n❌ 이메일과 비밀번호를 인자로 전달해주세요.');
    console.error('\n  실행 방법:');
    console.error('  npm run test:group -- 이메일 비밀번호');
    console.error('\n  예시:');
    console.error('  npm run test:group -- test@example.com mypassword\n');
    process.exit(1);
  }

  // ── 로그인 ──
  divider('로그인');
  info(`계정: ${TEST_EMAIL}`);

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  if (authError || !authData.user) {
    fail('로그인 실패', authError?.message);
    process.exit(1);
  }

  const userId = authData.user.id;
  pass(`로그인 성공 → user_id: ${userId}`);

  // ── 테스트 실행 ──
  let groupId: string | null = null;

  try {
    // 테스트 1: 그룹 생성
    groupId = await testCreateGroup(userId);
    if (!groupId) throw new Error('그룹 생성 실패로 이후 테스트를 중단합니다.');

    // 테스트 2: 초대 코드 발급
    await testGenerateInviteCode(userId, groupId);

    // 테스트 3: 내 그룹 목록 조회
    await testFetchMyGroups(userId, groupId);

    // 테스트 4: 멤버 목록 조회
    await testFetchGroupMembers(groupId, userId);

  } catch (err) {
    console.error('\n⛔ 테스트 도중 예외 발생:', err);
  } finally {
    // ── 정리 ──
    await cleanup();

    // ── 로그아웃 ──
    await supabase.auth.signOut();
    info('로그아웃 완료');

    console.log('\n' + '═'.repeat(50));
    console.log('  테스트 종료');
    console.log('═'.repeat(50) + '\n');
  }
}

main();
