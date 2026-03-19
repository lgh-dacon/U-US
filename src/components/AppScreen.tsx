import { PropsWithChildren, ReactNode } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { colors } from '../constants/colors';

type AppScreenProps = PropsWithChildren<{
  header?: ReactNode;
}>;

export function AppScreen({ children, header }: AppScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.spaceLayer} />
      <View style={styles.backgroundBubbleTop} />
      <View style={styles.backgroundBubbleBottom} />
      <View style={styles.backgroundGlowCenter} />
      <View style={styles.deviceShell}>
        <View style={styles.deviceFrame}>
          <View style={styles.deviceNotch} />
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {header}
            {children}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  spaceLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  deviceShell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Platform.OS === 'web' ? 18 : 0,
    paddingHorizontal: Platform.OS === 'web' ? 18 : 0,
  },
  deviceFrame: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 430 : '100%',
    overflow: 'hidden',
    borderRadius: Platform.OS === 'web' ? 36 : 0,
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: colors.border,
    backgroundColor: colors.background,
    shadowColor: colors.black,
    shadowOpacity: Platform.OS === 'web' ? 0.45 : 0,
    shadowRadius: Platform.OS === 'web' ? 28 : 0,
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'web' ? 18 : 0,
    },
    elevation: Platform.OS === 'web' ? 18 : 0,
  },
  deviceNotch: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 10 : -40,
    alignSelf: 'center',
    width: 140,
    height: 24,
    borderRadius: 999,
    backgroundColor: colors.black,
    zIndex: 2,
    opacity: Platform.OS === 'web' ? 1 : 0,
  },
  backgroundBubbleTop: {
    position: 'absolute',
    top: -60,
    right: -20,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: colors.glowPurple,
    opacity: 0.95,
  },
  backgroundBubbleBottom: {
    position: 'absolute',
    bottom: 80,
    left: -30,
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: colors.glowBlue,
    opacity: 0.95,
  },
  backgroundGlowCenter: {
    position: 'absolute',
    top: '38%',
    right: '12%',
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: colors.glowCyan,
    opacity: 0.85,
  },
});
