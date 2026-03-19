/**
 * 역할: 하단 탭 네비게이션 구조를 정의하는 파일입니다.
 * 실제 탭 디자인 설정은 src/constants/tabBar.ts에서 관리합니다.
 */
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { getTabBarIconName, tabBarTheme } from '../../src/constants/tabBar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: tabBarTheme.container,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIcon: ({ focused }) => {
          const iconName = getTabBarIconName(route.name, focused);

          return (
            <View style={[styles.item, focused ? tabBarTheme.activeItem : tabBarTheme.inactiveItem]}>
              <View style={tabBarTheme.iconWrap}>
                <Ionicons
                  color={focused ? tabBarTheme.activeIconColor : tabBarTheme.inactiveIconColor}
                  name={iconName}
                  size={22}
                />
              </View>
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: '홈' }} />
      <Tabs.Screen name="feed" options={{ title: '피드' }} />
      <Tabs.Screen name="timeline" options={{ title: '기록' }} />
      <Tabs.Screen name="preview" options={{ title: '전체' }} />
      <Tabs.Screen name="mypage" options={{ title: '마이' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarItem: {
    paddingHorizontal: 6,
  },
  item: {
    ...tabBarTheme.item,
  },
});
