import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { tabBarTheme } from '../../src/constants/tabBar';

const TAB_ICONS: Record<string, string> = {
  gallery: '🖼',
  planet: '🪐',
  calendar: '📅',
  upload: '➕',
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: tabBarTheme.container,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIcon: ({ focused }) => (
          <View style={[styles.item, focused ? tabBarTheme.activeItem : tabBarTheme.inactiveItem]}>
            <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
              {TAB_ICONS[route.name] ?? '●'}
            </Text>
          </View>
        ),
      })}
    >
      <Tabs.Screen name="gallery" options={{ title: '갤러리' }} />
      <Tabs.Screen name="planet" options={{ title: '행성' }} />
      <Tabs.Screen name="calendar" options={{ title: '캘린더' }} />
      <Tabs.Screen name="upload" options={{ title: '업로드' }} />
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
