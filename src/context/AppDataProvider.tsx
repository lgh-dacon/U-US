/**
 * 역할:
 * 이 파일은 앱 전체에서 공통으로 쓰는 데이터를 공급하는 전역 context입니다.
 *
 * 이 프로젝트에서는 2가지 종류의 데이터를 함께 관리합니다.
 * 1. 아직 DB와 연결되지 않은 mock 데이터
 *    - planetGroups
 *    - galleryPhotos
 *    - posts
 *    - calendarDays
 *    - onboardingSlides
 * 2. 이미 Supabase와 연결된 인증 데이터
 *    - session
 *    - isLoggedIn
 *    - currentUser
 *
 * 왜 여기서 관리하나?
 * - 로그인 상태는 앱의 여러 화면에서 동시에 필요합니다.
 * - 예를 들어 홈, 탭, 온보딩, 마이페이지가 모두 로그인 여부를 알아야 합니다.
 * - 그래서 개별 화면마다 따로 관리하지 않고, 앱 전체에서 공유되는 context로 올렸습니다.
 */
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

import { supabase } from '../lib/supabase';
import { fetchProfile, ProfileRow } from '../services/profileService';
import {
  currentUser as mockCurrentUser,
  planetGroups,
  galleryPhotos,
  posts,
  calendarDays,
  onboardingSlides,
} from '../data/mockData';

/**
 * Context를 통해 밖으로 내보낼 값들의 타입입니다.
 *
 * 초보자 관점에서 보면:
 * - 데이터 묶음
 * - 현재 로그인 상태
 * - 로그인/로그아웃 함수
 * 를 한 번에 정의한 "공용 계약서"라고 생각하면 됩니다.
 */
type AppDataValue = {
  currentUser: typeof mockCurrentUser;
  planetGroups: typeof planetGroups;
  galleryPhotos: typeof galleryPhotos;
  posts: typeof posts;
  calendarDays: typeof calendarDays;
  onboardingSlides: typeof onboardingSlides;
  activeGroupId: string;
  setActiveGroupId: (id: string) => void;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  session: Session | null;
  login: (nextSession?: Session | null) => Promise<void>;
  logout: () => Promise<void>;
};

/**
 * 실제 Context 객체를 만듭니다.
 *
 * 처음에는 null로 시작하고,
 * AppDataProvider 안에서 진짜 값을 넣어줍니다.
 */
const AppDataContext = createContext<AppDataValue | null>(null);

/**
 * Supabase Auth 사용자 + profiles 테이블 데이터를
 * 지금 앱에서 쓰는 currentUser 모양으로 변환하는 함수입니다.
 *
 * 왜 이런 변환이 필요한가?
 * - auth.users와 우리 앱 화면에서 필요한 user 모양은 다릅니다.
 * - 화면은 name, roleLabel, joinedAt, bio 같은 필드를 기대합니다.
 * - 그래서 Supabase 응답을 화면 친화적인 모양으로 한 번 변환합니다.
 *
 * 동작 방식:
 * 1. 이름은 profiles.nickname이 있으면 그걸 우선 사용
 * 2. 없으면 auth metadata의 full_name 사용
 * 3. 그것도 없으면 이메일 앞부분 사용
 * 4. 나머지 필드는 mockCurrentUser를 기본값으로 깔고 일부만 덮어씁니다.
 *
 * 이렇게 짠 이유:
 * - 아직 모든 사용자 정보를 DB에 다 넣지 않았더라도
 *   화면이 깨지지 않게 하려는 의도입니다.
 */
function buildCurrentUser(user: SupabaseUser, profile: ProfileRow | null) {
  const fallbackName = user.user_metadata?.full_name || user.email?.split('@')[0] || mockCurrentUser.name;

  return {
    ...mockCurrentUser,
    id: user.id,
    name: profile?.nickname || fallbackName,
    roleLabel: profile?.role_label || mockCurrentUser.roleLabel,
    joinedAt: user.created_at ? user.created_at.slice(0, 10).replace(/-/g, '.') : mockCurrentUser.joinedAt,
    bio: profile?.bio || `${user.email ?? 'member'} 계정으로 로그인 중입니다.`,
  };
}

/**
 * Provider 본체입니다.
 *
 * children:
 * - 이 Provider 안쪽에 있는 모든 화면/컴포넌트가
 *   useAppData()로 데이터를 꺼내 쓸 수 있게 됩니다.
 */
export function AppDataProvider({ children }: PropsWithChildren) {
  /**
   * activeGroupId:
   * - 현재 사용자가 보고 있는 그룹을 저장합니다.
   * - 아직 그룹 데이터는 mock이므로 첫 번째 그룹을 기본값으로 시작합니다.
   */
  const [activeGroupId, setActiveGroupId] = useState(planetGroups[0].id);

  /**
   * session:
   * - Supabase 로그인 세션 원본 객체입니다.
   *
   * isLoggedIn:
   * - 화면에서 더 쉽게 쓰도록 만든 boolean 상태입니다.
   *
   * isAuthLoading:
   * - 앱이 처음 켜졌을 때 "세션 확인 중인지"를 나타냅니다.
   * - 이 값이 없으면 로그인 여부 확인 전에 화면이 잠깐 잘못 보일 수 있습니다.
   *
   * currentUser:
   * - 화면에서 실제로 쓰는 사용자 정보입니다.
   * - 로그인 전에는 mockCurrentUser를 기본값으로 갖고 있다가,
   *   로그인되면 Supabase + profiles 기반 사용자로 바뀝니다.
   */
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(mockCurrentUser);

  /**
   * syncUserFromSession
   *
   * 무엇을 하나?
   * - session이 바뀔 때마다
   *   1. session 상태를 저장하고
   *   2. 로그인 여부를 계산하고
   *   3. 필요하면 profiles 테이블에서 사용자 프로필을 읽어와
   *   4. currentUser를 화면용 데이터로 갱신합니다.
   *
   * 왜 따로 함수로 뺐나?
   * - 이 로직은
   *   - 앱 시작 시 세션 확인할 때
   *   - auth 상태가 바뀔 때
   *   - 로그인 직후 수동으로 반영할 때
   *   여러 곳에서 반복해서 필요합니다.
   *
   * 한 함수로 빼두면 중복이 줄고,
   * 로그인 상태 동기화 규칙이 한 곳에 모여서 관리가 쉽습니다.
   */
  const syncUserFromSession = async (nextSession: Session | null) => {
    setSession(nextSession);
    setIsLoggedIn(!!nextSession);

    if (!nextSession?.user) {
      setCurrentUser(mockCurrentUser);
      return;
    }

    const { data } = await fetchProfile(nextSession.user.id);
    setCurrentUser(buildCurrentUser(nextSession.user, data ?? null));
  };

  /**
   * 앱 시작 시 한 번 실행되는 effect입니다.
   *
   * 하는 일:
   * 1. 현재 세션이 이미 있는지 확인
   * 2. auth 상태 변화(onAuthStateChange)를 구독
   * 3. 로그인/로그아웃/인증 완료 시마다 currentUser를 다시 동기화
   *
   * 왜 필요한가?
   * - 앱을 껐다 켜도 로그인 유지가 될 수 있기 때문입니다.
   * - 사용자가 이메일 인증을 완료하거나 로그아웃하면
   *   화면도 자동으로 같이 바뀌어야 합니다.
   *
   * isMounted를 쓰는 이유:
   * - 화면이 이미 사라진 뒤에 setState가 실행되는 걸 막기 위한 안전장치입니다.
   */
  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(async ({ data: { session: currentSession } }) => {
        if (!isMounted) {
          return;
        }

        await syncUserFromSession(currentSession);
        if (isMounted) {
          setIsAuthLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      await syncUserFromSession(nextSession);
      if (isMounted) {
        setIsAuthLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * login
   *
   * 무엇을 하나?
   * - 로그인 성공 직후 화면에서 이 함수를 호출하면
   *   현재 session 기준으로 provider 상태를 즉시 갱신합니다.
   *
   * nextSession을 optional로 받은 이유:
   * - 로그인 직후에는 새 session을 이미 알고 있으니 그 값을 바로 넘길 수 있고
   * - 안 넘기면 provider가 직접 getSession()으로 다시 읽어올 수 있게 하려는 설계입니다.
   */
  const login = async (nextSession?: Session | null) => {
    const sessionToUse = nextSession ?? (await supabase.auth.getSession()).data.session;
    await syncUserFromSession(sessionToUse);
  };

  /**
   * logout
   *
   * 무엇을 하나?
   * - Supabase 세션을 종료하고
   * - 앱 상태도 로그인 전 상태로 초기화합니다.
   *
   * 왜 currentUser를 mockCurrentUser로 되돌리나?
   * - 로그인 전에도 기존 화면 구조가 currentUser를 일부 참고하고 있어서
   *   최소한의 기본값을 유지해 화면이 깨지지 않게 하려는 목적입니다.
   */
  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsLoggedIn(false);
    setCurrentUser(mockCurrentUser);
  };

  /**
   * Provider가 실제로 자식 컴포넌트들에게 공급하는 값입니다.
   *
   * 여기 들어 있는 값들은
   * useAppData()를 통해 앱 어디서든 꺼내 쓸 수 있습니다.
   */
  return (
    <AppDataContext.Provider
      value={{
        currentUser,
        planetGroups,
        galleryPhotos,
        posts,
        calendarDays,
        onboardingSlides,
        activeGroupId,
        setActiveGroupId,
        isLoggedIn,
        isAuthLoading,
        session,
        login,
        logout,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

/**
 * useAppData
 *
 * 무엇을 하나?
 * - AppDataContext 값을 꺼내 쓰는 커스텀 훅입니다.
 *
 * 왜 그냥 useContext를 직접 안 쓰나?
 * - 사용하는 쪽 코드가 더 짧고 읽기 쉬워집니다.
 * - Provider 밖에서 잘못 썼을 때 명확한 에러 메시지를 줄 수 있습니다.
 *
 * 즉, 이 프로젝트에서는
 * `useContext(AppDataContext)` 대신
 * `useAppData()`만 쓰면 된다고 이해하면 됩니다.
 */
export function useAppData() {
  const value = useContext(AppDataContext);
  if (!value) {
    throw new Error('useAppData must be used inside AppDataProvider');
  }
  return value;
}
