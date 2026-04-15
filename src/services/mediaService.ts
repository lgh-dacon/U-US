/**
 * 역할: media 테이블 조회를 담당하는 파일입니다.
 *
 * 이 파일에서 할 수 있는 것:
 * 1. fetchMyMedia   — 내가 올린 미디어(사진/영상) 목록 조회
 * 2. fetchGroupMedia — 특정 그룹의 미디어 목록 조회
 * 3. fetchMediaById  — 미디어 단건 조회
 *
 * 데이터 출처:
 * - media 테이블 (uploader_id로 내 미디어 필터링)
 */
import { supabase } from '../lib/supabase';

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────

/**
 * 미디어 한 건의 구조입니다.
 *
 * media_type: 'photo'(사진) 또는 'video'(영상)
 * url: 실제 파일이 저장된 Supabase Storage 경로 또는 외부 URL
 * thumbnail_url: 영상의 경우 썸네일 이미지 URL (사진은 url과 같거나 null)
 * caption: 미디어에 붙인 설명 텍스트
 * metadata: EXIF 정보, 태그 등 추가 정보 (JSON 형태)
 */
export type MediaRow = {
  id: string;
  post_id: string | null;
  group_id: string;
  uploader_id: string;
  media_type: 'photo' | 'video' | string;
  url: string;
  thumbnail_url: string | null;
  caption: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

// ─────────────────────────────────────────────
// 공개 함수
// ─────────────────────────────────────────────

/**
 * 내가 올린 미디어(사진/영상) 목록을 최신순으로 가져옵니다.
 *
 * 사용 예:
 *   const { data, error } = await fetchMyMedia(userId);
 *   if (error) { ... }                  // 조회 실패 처리
 *   if (!data || data.length === 0) { ... } // 미디어 없음 처리
 *
 * 동작 흐름:
 * 1. media 테이블에서 uploader_id = userId 인 행을 조회합니다.
 * 2. 최신 업로드가 위에 오도록 created_at 내림차순으로 정렬합니다.
 * 3. 한 번에 최대 100건까지 가져옵니다.
 *
 * RLS 정책:
 * - media의 SELECT 정책이 "같은 그룹 멤버만 조회 가능"이므로
 *   탈퇴한 그룹의 미디어는 자동으로 제외됩니다.
 *
 * @param userId - 현재 로그인한 유저의 UUID
 */
export async function fetchMyMedia(userId: string) {
  return supabase
    .from('media')
    .select(`
      id,
      post_id,
      group_id,
      uploader_id,
      media_type,
      url,
      thumbnail_url,
      caption,
      metadata,
      created_at
    `)
    // 내가 올린 미디어만 필터링합니다.
    .eq('uploader_id', userId)
    // 최신순으로 정렬합니다.
    .order('created_at', { ascending: false })
    // 한 번에 너무 많은 데이터를 가져오지 않도록 100건으로 제한합니다.
    .limit(100)
    // 반환 타입을 명시합니다.
    .returns<MediaRow[]>();
}

/**
 * 특정 그룹의 미디어 목록을 최신순으로 가져옵니다.
 *
 * 언제 쓰나?
 * - 그룹 상세 화면에서 "이 그룹의 사진/영상 모아보기" 기능을 만들 때 씁니다.
 *
 * @param groupId - 조회할 그룹의 UUID
 * @param limit   - 가져올 최대 건수 (기본값 50)
 */
export async function fetchGroupMedia(groupId: string, limit = 50) {
  return supabase
    .from('media')
    .select(`
      id,
      post_id,
      group_id,
      uploader_id,
      media_type,
      url,
      thumbnail_url,
      caption,
      metadata,
      created_at
    `)
    // 해당 그룹의 미디어만 필터링합니다.
    .eq('group_id', groupId)
    // 최신순으로 정렬합니다.
    .order('created_at', { ascending: false })
    .limit(limit)
    .returns<MediaRow[]>();
}

/**
 * 미디어 한 건을 id로 조회합니다.
 *
 * 언제 쓰나?
 * - 미디어를 클릭했을 때 상세 정보를 보여주는 화면에서 씁니다.
 *
 * maybeSingle(): 결과가 0건이면 null, 1건이면 data 객체를 반환합니다.
 *
 * @param mediaId - 조회할 미디어의 UUID
 */
export async function fetchMediaById(mediaId: string) {
  return supabase
    .from('media')
    .select(`
      id,
      post_id,
      group_id,
      uploader_id,
      media_type,
      url,
      thumbnail_url,
      caption,
      metadata,
      created_at
    `)
    .eq('id', mediaId)
    .maybeSingle<MediaRow>();
}

/**
 * 미디어 타입별로 내 미디어를 필터링해서 가져옵니다.
 *
 * 언제 쓰나?
 * - 마이페이지에서 "내 사진만 보기" / "내 영상만 보기" 탭을 구분할 때 씁니다.
 *
 * @param userId    - 현재 로그인한 유저의 UUID
 * @param mediaType - 'photo' 또는 'video'
 */
export async function fetchMyMediaByType(userId: string, mediaType: 'photo' | 'video') {
  return supabase
    .from('media')
    .select(`
      id,
      post_id,
      group_id,
      uploader_id,
      media_type,
      url,
      thumbnail_url,
      caption,
      metadata,
      created_at
    `)
    // 내가 올린 미디어 중에서
    .eq('uploader_id', userId)
    // 지정한 타입(photo 또는 video)만 필터링합니다.
    .eq('media_type', mediaType)
    .order('created_at', { ascending: false })
    .limit(100)
    .returns<MediaRow[]>();
}
