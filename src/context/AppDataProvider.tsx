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

const AppDataContext = createContext<AppDataValue | null>(null);

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

export function AppDataProvider({ children }: PropsWithChildren) {
  const [activeGroupId, setActiveGroupId] = useState(planetGroups[0].id);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(mockCurrentUser);

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

  const login = async (nextSession?: Session | null) => {
    const sessionToUse = nextSession ?? (await supabase.auth.getSession()).data.session;
    await syncUserFromSession(sessionToUse);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsLoggedIn(false);
    setCurrentUser(mockCurrentUser);
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

export function useAppData() {
  const value = useContext(AppDataContext);
  if (!value) {
    throw new Error('useAppData must be used inside AppDataProvider');
  }
  return value;
}
