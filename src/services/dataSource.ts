/**
 * 역할: 지금은 mock 데이터를 쓰되, 나중에 Supabase 또는 Firebase 연결 지점을 한곳에 모으기 위한 가이드 파일입니다.
 */
export type BackendProvider = 'mock' | 'supabase' | 'firebase';

export const dataSourceConfig = {
  activeProvider: 'mock' as BackendProvider,
  notes: {
    mock: 'src/data/mockData.ts를 그대로 사용합니다.',
    supabase: 'services 폴더에 auth, groups, posts API 파일을 추가해 연결합니다.',
    firebase: 'Firestore 컬렉션 구조에 맞춰 읽기/쓰기 함수를 추가합니다.',
  },
};
