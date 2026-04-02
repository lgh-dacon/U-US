/**
 * 역할: 화면에서 공통으로 쓰는 간단한 문자열 포맷 함수 모음입니다.
 */
export function formatCountLabel(count: number, unit: string) {
  return `${count}${unit}`;
}

export function formatMediaType(type: 'photo' | 'video') {
  return type === 'photo' ? '사진' : '영상';
}
