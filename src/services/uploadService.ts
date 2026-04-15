/**
 * 역할: Supabase Storage에 미디어 파일을 업로드하고,
 *       media 테이블에 메타데이터를 저장하는 파일입니다.
 *
 * 이 파일에서 할 수 있는 것:
 * 1. uploadMedia  — 파일을 Storage에 업로드 후 media 테이블에 저장
 * 2. deleteMedia  — Storage 파일 삭제 + media 테이블 행 삭제
 * 3. getPublicUrl — Storage 경로로부터 공개 URL을 만들어 반환
 *
 * Supabase Storage 구조:
 * - 버킷(bucket) 이름: 'media'
 * - 파일 경로: {group_id}/{user_id}/{타임스탬프}_{파일명}
 *   예: group-uuid/user-uuid/1716000000000_photo.jpg
 *
 * 왜 경로를 이렇게 만드나?
 * - group_id 폴더로 나누면 그룹별 파일이 정리됩니다.
 * - user_id 폴더로 나누면 사용자별 파일이 구분됩니다.
 * - 타임스탬프를 앞에 붙이면 같은 이름의 파일이 충돌하지 않습니다.
 *
 * 연동 테이블:
 * - media: 업로드된 파일의 URL, 타입, 캡션 등 메타데이터 저장
 */
import { supabase } from '../lib/supabase';

// Supabase Storage에서 사용할 버킷 이름입니다.
// Supabase Dashboard > Storage에서 'media' 버킷을 먼저 생성해야 합니다.
const STORAGE_BUCKET = 'media';

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────

/**
 * uploadMedia 함수에 넘기는 입력 타입입니다.
 *
 * file     : 업로드할 파일 객체 (React Native에서는 { uri, name, type } 형태)
 * groupId  : 어느 그룹의 파일인지
 * postId   : 어느 게시물에 연결할지 (나중에 연결할 경우 null)
 * mediaType: 'photo' 또는 'video'
 * caption  : 파일에 붙일 설명 텍스트
 */
export type UploadMediaInput = {
  file: {
    uri: string;   // 로컬 파일 경로 (예: file:///storage/.../photo.jpg)
    name: string;  // 파일명 (예: photo.jpg)
    type: string;  // MIME 타입 (예: image/jpeg, video/mp4)
  };
  groupId: string;
  postId?: string | null;
  mediaType?: 'photo' | 'video';
  caption?: string;
};

/**
 * media 테이블 한 행의 구조입니다.
 */
export type MediaRow = {
  id: string;
  post_id: string | null;
  group_id: string;
  uploader_id: string;
  media_type: string;
  url: string;
  thumbnail_url: string | null;
  caption: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

// ─────────────────────────────────────────────
// 내부 헬퍼 함수
// ─────────────────────────────────────────────

/**
 * Storage에 저장할 파일 경로를 만듭니다.
 *
 * 형식: {group_id}/{user_id}/{타임스탬프}_{파일명}
 * 예  : group-abc/user-xyz/1716000000000_photo.jpg
 *
 * 타임스탬프를 앞에 붙이는 이유:
 * - 같은 이름의 파일을 여러 번 올려도 충돌이 발생하지 않습니다.
 */
function buildStoragePath(groupId: string, userId: string, fileName: string): string {
  const timestamp = Date.now();
  // 파일명에 특수문자나 공백이 있으면 오류가 날 수 있으므로 간단히 정리합니다.
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${groupId}/${userId}/${timestamp}_${safeName}`;
}

// ─────────────────────────────────────────────
// 공개 함수
// ─────────────────────────────────────────────

/**
 * 1. 미디어 파일을 Storage에 업로드하고 media 테이블에 저장합니다.
 *
 * 동작 흐름:
 * 1) Storage 경로를 만들고 파일을 업로드합니다.
 * 2) 업로드된 파일의 공개 URL을 가져옵니다.
 * 3) media 테이블에 URL과 메타데이터를 저장합니다.
 *
 * React Native에서 파일 전달 방법:
 *   const result = await ImagePicker.launchImageLibraryAsync(...);
 *   const file = {
 *     uri: result.assets[0].uri,
 *     name: result.assets[0].fileName ?? 'photo.jpg',
 *     type: result.assets[0].type === 'video' ? 'video/mp4' : 'image/jpeg',
 *   };
 *   await uploadMedia(userId, { file, groupId, mediaType: 'photo' });
 *
 * @param userId - 업로드하는 사람(현재 로그인한 유저)의 UUID
 * @param input  - 업로드 정보
 */
export async function uploadMedia(
  userId: string,
  input: UploadMediaInput
): Promise<{ data: MediaRow | null; error: Error | null }> {
  const storagePath = buildStoragePath(input.groupId, userId, input.file.name);

  // ① Storage에 파일 업로드
  // React Native에서는 파일 URI를 직접 전달합니다.
  // FormData 없이 Blob 또는 ArrayBuffer를 넘길 수도 있지만,
  // 여기서는 React Native 환경에 맞게 fetch로 파일을 읽어 업로드합니다.
  const response = await fetch(input.file.uri);
  const blob = await response.blob();

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, blob, {
      contentType: input.file.type,
      // upsert: false → 같은 경로에 파일이 이미 있으면 에러를 냅니다.
      // (타임스탬프가 붙어있으므로 실제로는 충돌이 거의 없습니다.)
      upsert: false,
    });

  if (uploadError) {
    return { data: null, error: uploadError };
  }

  // ② Storage에서 공개 URL 가져오기
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  const publicUrl = urlData.publicUrl;

  // ③ media 테이블에 메타데이터 저장
  const { data: media, error: dbError } = await supabase
    .from('media')
    .insert({
      post_id: input.postId ?? null,
      group_id: input.groupId,
      uploader_id: userId,
      media_type: input.mediaType ?? 'photo',
      url: publicUrl,
      thumbnail_url: null,    // 영상 썸네일은 별도 처리 필요 (지금은 null)
      caption: input.caption ?? '',
      metadata: {
        storage_path: storagePath, // 나중에 삭제할 때 필요하므로 경로를 저장합니다.
        original_name: input.file.name,
        mime_type: input.file.type,
      },
    })
    .select('id, post_id, group_id, uploader_id, media_type, url, thumbnail_url, caption, metadata, created_at')
    .single<MediaRow>();

  if (dbError || !media) {
    // DB 저장 실패 시: Storage에서도 파일을 삭제해 불필요한 파일이 남지 않게 합니다.
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
    return { data: null, error: dbError ?? new Error('미디어 정보 저장에 실패했습니다.') };
  }

  return { data: media, error: null };
}

/**
 * 2. 미디어를 삭제합니다. (Storage 파일 + media 테이블 행 모두 삭제)
 *
 * 동작 흐름:
 * 1) media 테이블에서 해당 행의 metadata.storage_path를 읽습니다.
 * 2) Storage에서 파일을 삭제합니다.
 * 3) media 테이블에서 행을 삭제합니다.
 *
 * 왜 storage_path를 metadata에 저장했나?
 * - 공개 URL만으로는 Storage 내부 경로를 역산하기 어렵습니다.
 * - 업로드 시 metadata에 경로를 기록해두면 삭제가 쉬워집니다.
 *
 * @param mediaId - 삭제할 미디어의 UUID (media 테이블의 id)
 */
export async function deleteMedia(
  mediaId: string
): Promise<{ success: boolean; error?: string }> {
  // ① media 테이블에서 storage_path 가져오기
  const { data: media, error: fetchError } = await supabase
    .from('media')
    .select('id, metadata')
    .eq('id', mediaId)
    .maybeSingle();

  if (fetchError) {
    return { success: false, error: '미디어 정보 조회에 실패했습니다.' };
  }

  if (!media) {
    return { success: false, error: '존재하지 않는 미디어입니다.' };
  }

  // ② Storage에서 파일 삭제
  // metadata에서 storage_path를 꺼냅니다.
  const storagePath = (media.metadata as Record<string, unknown>)?.storage_path as string | undefined;

  if (storagePath) {
    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath]);

    if (storageError) {
      // Storage 삭제 실패 시에도 DB 행은 삭제합니다.
      // (Storage에 고아 파일이 남을 수 있지만, DB 무결성을 우선합니다.)
      console.warn('Storage 파일 삭제 실패 (DB 행은 삭제 진행):', storageError.message);
    }
  }

  // ③ media 테이블 행 삭제
  const { error: dbError } = await supabase
    .from('media')
    .delete()
    .eq('id', mediaId);

  if (dbError) {
    return { success: false, error: '미디어 DB 삭제에 실패했습니다.' };
  }

  return { success: true };
}

/**
 * 3. Storage 경로로부터 공개 URL을 가져옵니다.
 *
 * 언제 쓰나?
 * - 이미 Storage에 올라간 파일의 URL을 다시 얻어야 할 때 씁니다.
 * - 업로드 시에는 uploadMedia 내부에서 자동으로 처리됩니다.
 *
 * @param storagePath - Storage 내부 경로 (예: group-id/user-id/timestamp_photo.jpg)
 */
export function getPublicUrl(storagePath: string): string {
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath);
  return data.publicUrl;
}

/**
 * 4. 게시물에 미디어를 연결합니다.
 *
 * 언제 쓰나?
 * - 미디어를 먼저 올리고 나서 게시물을 나중에 만들 때 씁니다.
 * - 또는 이미 올라간 미디어를 새 게시물에 연결할 때 씁니다.
 *
 * @param mediaId - 연결할 미디어의 UUID
 * @param postId  - 연결할 게시물의 UUID
 */
export async function attachMediaToPost(mediaId: string, postId: string) {
  return supabase
    .from('media')
    .update({ post_id: postId })
    .eq('id', mediaId);
}
