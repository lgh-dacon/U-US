/**
 * 역할: mock 데이터를 전역으로 공급하는 간단한 컨텍스트 파일입니다.
 * 나중에 실제 데이터 연결 시 이 파일에서 mock 대신 API 결과를 내려주면 됩니다.
 */
import { createContext, PropsWithChildren, useContext } from 'react';

import {
  currentUser,
  calendarTimelineMockExample,
  groups,
  onboardingSlides,
  posts,
  recaps,
  screenRequirements,
  thenNowComparisons,
  timelineItems,
} from '../data/mockData';

type AppDataValue = {
  currentUser: typeof currentUser;
  calendarTimelineMockExample: typeof calendarTimelineMockExample;
  groups: typeof groups;
  posts: typeof posts;
  recaps: typeof recaps;
  onboardingSlides: typeof onboardingSlides;
  thenNowComparisons: typeof thenNowComparisons;
  timelineItems: typeof timelineItems;
  screenRequirements: typeof screenRequirements;
};

const AppDataContext = createContext<AppDataValue | null>(null);

export function AppDataProvider({ children }: PropsWithChildren) {
  return (
    <AppDataContext.Provider
      value={{
        currentUser,
        calendarTimelineMockExample,
        groups,
        posts,
        recaps,
        onboardingSlides,
        thenNowComparisons,
        timelineItems,
        screenRequirements,
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
