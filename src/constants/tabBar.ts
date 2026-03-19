/**
 * 역할: 하단 탭의 아이콘, 라벨, active/inactive 스타일을 한곳에 모아둔 설정 파일입니다.
 * 초보자는 colors.ts와 이 파일만 보면 탭 디자인을 쉽게 수정할 수 있습니다.
 */
import { Ionicons } from '@expo/vector-icons';

import { colors } from './colors';

export type TabRouteName = 'index' | 'feed' | 'timeline' | 'preview' | 'mypage';

export function getTabBarIconName(
  routeName: string,
  focused: boolean
): keyof typeof Ionicons.glyphMap {
  const iconMap: Record<TabRouteName, keyof typeof Ionicons.glyphMap> = {
    index: focused ? 'home' : 'home-outline',
    feed: focused ? 'images' : 'images-outline',
    timeline: focused ? 'calendar' : 'calendar-outline',
    preview: focused ? 'grid' : 'grid-outline',
    mypage: focused ? 'person' : 'person-outline',
  };

  return iconMap[routeName as TabRouteName] ?? 'ellipse-outline';
}

export const tabBarTheme = {
  container: {
    backgroundColor: colors.surfaceElevated,
    borderTopColor: colors.divider,
    height: 86,
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 14,
  },
  item: {
    minWidth: 64,
    height: 48,
    borderRadius: 999,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 14,
  },
  activeItem: {
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.secondarySoft,
    shadowColor: colors.black,
    shadowOpacity: 0.24,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 6,
  },
  inactiveItem: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconWrap: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  activeIconColor: colors.accent,
  inactiveIconColor: colors.textSoft,
};
