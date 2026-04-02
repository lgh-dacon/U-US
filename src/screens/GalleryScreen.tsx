/**
 * 역할: 그룹 갤러리를 2열 masonry 레이아웃으로 보여주는 화면입니다.
 * Figma: U_US_3갤러리.png, U_US_3갤러리-1.png
 */
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '../constants/colors';
import { useAppData } from '../context/AppDataProvider';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMN_GAP = 5;
const HORIZONTAL_PADDING = 16;
const COLUMN_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - COLUMN_GAP) / 2;

/** Height multipliers to create masonry-style variation. Left column items are slightly taller. */
const LEFT_HEIGHTS = [1.3, 1.0, 1.4, 1.1, 1.35, 1.05];
const RIGHT_HEIGHTS = [1.0, 1.3, 1.05, 1.35, 1.0, 1.4];

export default function GalleryScreen() {
  const router = useRouter();
  const { galleryPhotos, planetGroups, activeGroupId } = useAppData();

  const activeGroup = planetGroups.find((g) => g.id === activeGroupId) ?? planetGroups[0];
  const filteredPhotos = galleryPhotos.filter((p) => p.groupId === activeGroupId);

  const { leftColumn, rightColumn } = useMemo(() => {
    const left: typeof filteredPhotos = [];
    const right: typeof filteredPhotos = [];
    filteredPhotos.forEach((photo, index) => {
      if (index % 2 === 0) {
        left.push(photo);
      } else {
        right.push(photo);
      }
    });
    return { leftColumn: left, rightColumn: right };
  }, [filteredPhotos]);

  const getItemHeight = (columnIndex: number, itemIndex: number) => {
    const heights = columnIndex === 0 ? LEFT_HEIGHTS : RIGHT_HEIGHTS;
    const baseHeight = COLUMN_WIDTH;
    return baseHeight * heights[itemIndex % heights.length];
  };

  const handlePhotoPress = (photoId: string) => {
    router.push(`/post/${photoId}` as any);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.groupNameRow}>
          <Text style={styles.planetIcon}>🪐</Text>
          <Text style={styles.groupName}>{activeGroup?.name ?? '갤러리'}</Text>
        </View>
        <Text style={styles.subtitle}>
          {activeGroup
            ? `사진 ${activeGroup.photoCount} · 동영상 ${activeGroup.videoCount}`
            : ''}
        </Text>
      </View>

      {/* Masonry Grid */}
      <ScrollView
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Left Column */}
        <View style={styles.column}>
          {leftColumn.map((photo, index) => (
            <Pressable
              key={photo.id}
              onPress={() => handlePhotoPress(photo.id)}
              style={styles.photoWrapper}
            >
              <Image
                source={{ uri: photo.uri }}
                style={[
                  styles.photo,
                  { height: getItemHeight(0, index) },
                ]}
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </View>

        {/* Right Column */}
        <View style={styles.column}>
          {rightColumn.map((photo, index) => (
            <Pressable
              key={photo.id}
              onPress={() => handlePhotoPress(photo.id)}
              style={styles.photoWrapper}
            >
              <Image
                source={{ uri: photo.uri }}
                style={[
                  styles.photo,
                  { height: getItemHeight(1, index) },
                ]}
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 16,
  },
  groupNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planetIcon: {
    fontSize: 20,
  },
  groupName: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 6,
    marginLeft: 28,
  },
  gridContainer: {
    flexDirection: 'row',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 100,
  },
  column: {
    flex: 1,
    gap: COLUMN_GAP,
  },
  photoWrapper: {
    marginRight: COLUMN_GAP,
  },
  photo: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
});
