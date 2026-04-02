import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';

import { supabase } from '../lib/supabase';
import {
  currentUser,
  planetGroups,
  galleryPhotos,
  posts,
  calendarDays,
  onboardingSlides,
} from '../data/mockData';

type AppDataValue = {
  currentUser: typeof currentUser;
  planetGroups: typeof planetGroups;
  galleryPhotos: typeof galleryPhotos;
  posts: typeof posts;
  calendarDays: typeof calendarDays;
  onboardingSlides: typeof onboardingSlides;
  activeGroupId: string;
  setActiveGroupId: (id: string) => void;
  isLoggedIn: boolean;
  session: Session | null;
  login: () => void;
  logout: () => void;
};

const AppDataContext = createContext<AppDataValue | null>(null);

export function AppDataProvider({ children }: PropsWithChildren) {
  const [activeGroupId, setActiveGroupId] = useState(planetGroups[0].id);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoggedIn(!!session);
    });

    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = () => setIsLoggedIn(true);

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsLoggedIn(false);
  };

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
        session,
        login,
        logout,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const value = useContext(AppDataContext);
  if (!value) {
    throw new Error('useAppData must be used inside AppDataProvider');
  }
  return value;
}
