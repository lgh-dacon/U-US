import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const EARTH_VIDEO = require('../../assets/earth.mp4');
const LOGO_DEFAULT = require('../../assets/logo1.png');
const LOGO_HOVER = require('../../assets/logo2.png');

import { useAppData } from '../context/AppDataProvider';

const VIDEO_ASPECT = 16 / 9;

export default function OnboardingScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAppData();
  const [isHovered, setIsHovered] = useState(false);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // 화면 높이에 맞춰 영상 크기 계산 → 지구본(중앙) 항상 보이도록
  const videoHeight = screenHeight;
  const videoWidth = screenHeight * VIDEO_ASPECT;

  return (
    <View style={styles.container}>
      {/* 배경 지구 동영상 — 높이 기준으로 비율 유지, 가로 중앙 정렬 */}
      <View style={styles.videoWrapper}>
        <Video
          source={EARTH_VIDEO}
          style={{
            width: videoWidth,
            height: videoHeight,
          }}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
        />
      </View>

      {/* 하단 콘텐츠 */}
      <View style={styles.bottomContent}>
        <View style={styles.taglineWrap}>
          <Text style={styles.tagline}>기억의 저편,</Text>
          <Text style={styles.tagline}>우리만의 행성으로</Text>
        </View>
        <Pressable
          onPress={() => isLoggedIn ? router.replace('/(tabs)/planet') : router.push('/login')}
          onHoverIn={() => setIsHovered(true)}
          onHoverOut={() => setIsHovered(false)}
          style={styles.logoWrap}
        >
          <Image
            source={isHovered ? LOGO_HOVER : LOGO_DEFAULT}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 80,
    overflow: 'hidden',
  },
  videoWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bottomContent: {
    alignItems: 'center',
    gap: 20,
  },
  taglineWrap: {
    alignItems: 'center',
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 18 * 1.35,
  },
  logoWrap: {
    height: 56,
    width: 135,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 135,
    height: 56,
  },
});
