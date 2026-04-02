import React, { useRef, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { colors } from '../constants/colors';
import { useAppData } from '../context/AppDataProvider';

const MAIN_PLANET_SIZE = 225;
const SMALL_PLANET_SIZE = Math.round(225 * 0.5);
// 각 행성 아이템 높이 (스냅 기준)
const ITEM_HEIGHT = MAIN_PLANET_SIZE + 40;

const PLANET_IMAGES: ImageSourcePropType[] = [
  require('../../assets/planet_4.png'), // 지구
  require('../../assets/planet_1.png'), // 파란
  require('../../assets/planet_3.png'), // 주황
];

export default function PlanetScreen() {
  const { planetGroups, setActiveGroupId } = useAppData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  const group = planetGroups[currentIndex];

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const page = Math.round(offsetY / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(page, planetGroups.length - 1));
    if (clamped !== currentIndex) {
      setCurrentIndex(clamped);
    }
  };

  return (
    <View style={styles.root}>
      {/* 행성 스크롤 영역 */}
      <View style={styles.planetViewport}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="center"
          decelerationRate="fast"
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            // 위아래 패딩으로 첫/마지막 행성도 가운데 올 수 있도록
            paddingVertical: (ITEM_HEIGHT * 2 - MAIN_PLANET_SIZE) / 2,
            alignItems: 'center',
          }}
        >
          {PLANET_IMAGES.map((img, i) => {
            const isActive = i === currentIndex;
            return (
              <View key={i} style={styles.planetItem}>
                <Pressable
                  style={isActive ? styles.mainPlanetWrap : styles.smallPlanetWrap}
                  onPress={isActive ? () => {
                    setActiveGroupId(planetGroups[i].id);
                    router.push('/(tabs)/gallery');
                  } : undefined}
                >
                  <Image
                    source={img}
                    style={isActive ? styles.mainPlanet : styles.smallPlanet}
                    resizeMode="contain"
                  />
                  {!isActive && <View style={styles.darkOverlay} />}
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* 하단 고정 그룹 정보 */}
      <View style={styles.infoArea}>
        <Text style={styles.groupName}>{group.name}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>👥</Text>
          <Text style={styles.infoText}>{group.subtitle}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🖼</Text>
          <Text style={styles.infoText}>{group.photoCount}개</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🎬</Text>
          <Text style={styles.infoText}>{group.videoCount}개</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🏆</Text>
          <Text style={styles.infoText}>{group.members.length}</Text>
        </View>
      </View>

      {/* 설정 아이콘 */}
      <View style={styles.settingsIcon}>
        <Text style={{ fontSize: 20 }}>⚙️</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },

  /* 행성 뷰포트: 가운데 큰 행성 + 위아래 살짝 보이는 영역 */
  planetViewport: {
    flex: 1,
    overflow: 'hidden',
  },
  planetItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainPlanetWrap: {
    width: MAIN_PLANET_SIZE,
    height: MAIN_PLANET_SIZE,
  },
  smallPlanetWrap: {
    width: SMALL_PLANET_SIZE,
    height: SMALL_PLANET_SIZE,
    overflow: 'hidden',
    borderRadius: SMALL_PLANET_SIZE / 2,
  },
  mainPlanet: {
    width: MAIN_PLANET_SIZE,
    height: MAIN_PLANET_SIZE,
  },
  smallPlanet: {
    width: SMALL_PLANET_SIZE,
    height: SMALL_PLANET_SIZE,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: SMALL_PLANET_SIZE / 2,
  },

  /* 하단 고정 정보 */
  infoArea: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
    gap: 10,
    alignItems: 'center',
  },
  groupName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoIcon: {
    fontSize: 14,
  },
  infoText: {
    fontSize: 15,
    color: '#FFFFFF',
  },

  /* 설정 */
  settingsIcon: {
    position: 'absolute',
    bottom: 100,
    right: 24,
  },
});
