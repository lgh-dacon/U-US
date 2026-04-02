import { Ionicons } from '@expo/vector-icons';

import { colors } from './colors';

export type TabRouteName = 'gallery' | 'planet' | 'calendar' | 'upload';

export function getTabBarIconName(
  routeName: string,
  focused: boolean
): keyof typeof Ionicons.glyphMap {
  const iconMap: Record<TabRouteName, keyof typeof Ionicons.glyphMap> = {
    gallery: focused ? 'images' : 'images-outline',
    planet: focused ? 'planet' : 'planet-outline',
    calendar: focused ? 'calendar' : 'calendar-outline',
    upload: focused ? 'add-circle' : 'add-circle-outline',
  };

  return iconMap[routeName as TabRouteName] ?? 'ellipse-outline';
}

export const tabBarTheme = {
  container: {
    backgroundColor: colors.background,
    borderTopColor: colors.divider,
    borderTopWidth: 0.5,
    height: 80,
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  item: {
    minWidth: 56,
    height: 44,
    borderRadius: 999,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 12,
  },
  activeItem: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  inactiveItem: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  iconWrap: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  activeIconColor: colors.white,
  inactiveIconColor: colors.textSoft,
};
