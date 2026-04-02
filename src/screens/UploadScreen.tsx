/**
 * 역할: 카메라 스타일의 사진/영상 업로드 화면입니다.
 * Figma: U_US_9바로업로드_1.png, U_US_9바로업로드_2.png
 */
import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { colors } from '../constants/colors';
import { useAppData } from '../context/AppDataProvider';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_GAP = 2;
const NUM_COLUMNS = 3;
const THUMB_SIZE = (SCREEN_WIDTH - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

type MediaMode = 'photo' | 'video';

export default function UploadScreen() {
  const { galleryPhotos } = useAppData();
  const [selectedId, setSelectedId] = useState<string>(galleryPhotos[0]?.id ?? '');
  const [mode, setMode] = useState<MediaMode>('photo');
  const [flashOn, setFlashOn] = useState(false);

  const selectedPhoto = galleryPhotos.find((p) => p.id === selectedId) ?? galleryPhotos[0];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.headerLeft}>
          <Ionicons name="close" size={24} color={colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>우리의 작은 일상</Text>
        <Pressable style={styles.headerRight}>
          <Text style={styles.planetInfoText}>Planet Info</Text>
        </Pressable>
      </View>

      {/* Selected Photo Preview */}
      <View style={styles.previewContainer}>
        {selectedPhoto ? (
          <Image
            source={{ uri: selectedPhoto.uri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.previewPlaceholder}>
            <Ionicons name="image-outline" size={48} color={colors.textSoft} />
          </View>
        )}
      </View>

      {/* Photo Grid */}
      <View style={styles.gridSection}>
        <View style={styles.gridHeader}>
          <Text style={styles.gridTitle}>최근 항목</Text>
          <Pressable style={styles.gridDropdown}>
            <Text style={styles.gridDropdownText}>모든 사진</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
          </Pressable>
        </View>
        <FlatList
          data={galleryPhotos}
          numColumns={NUM_COLUMNS}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item }) => {
            const isSelected = item.id === selectedId;
            return (
              <Pressable onPress={() => setSelectedId(item.id)}>
                <Image
                  source={{ uri: item.uri }}
                  style={[styles.gridThumb, isSelected && styles.gridThumbSelected]}
                  resizeMode="cover"
                />
                {isSelected && (
                  <View style={styles.selectedOverlay}>
                    <View style={styles.selectedBadge}>
                      <Ionicons name="checkmark" size={14} color={colors.white} />
                    </View>
                  </View>
                )}
              </Pressable>
            );
          }}
        />
      </View>

      {/* Camera Controls */}
      <View style={styles.cameraControls}>
        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <Pressable
            onPress={() => setMode('photo')}
            style={[styles.modeButton, mode === 'photo' && styles.modeButtonActive]}
          >
            <Text style={[styles.modeText, mode === 'photo' && styles.modeTextActive]}>
              사진
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('video')}
            style={[styles.modeButton, mode === 'video' && styles.modeButtonActive]}
          >
            <Text style={[styles.modeText, mode === 'video' && styles.modeTextActive]}>
              영상
            </Text>
          </Pressable>
        </View>

        {/* Shutter Row */}
        <View style={styles.shutterRow}>
          {/* Last photo thumbnail */}
          <Pressable style={styles.lastPhotoWrap}>
            {galleryPhotos[0] && (
              <Image
                source={{ uri: galleryPhotos[0].uri }}
                style={styles.lastPhotoThumb}
                resizeMode="cover"
              />
            )}
          </Pressable>

          {/* Shutter Button */}
          <Pressable style={styles.shutterOuter}>
            <View
              style={[
                styles.shutterInner,
                mode === 'video' && styles.shutterInnerVideo,
              ]}
            />
          </Pressable>

          {/* Camera Controls Right */}
          <View style={styles.cameraRight}>
            <Pressable onPress={() => setFlashOn(!flashOn)}>
              <Ionicons
                name={flashOn ? 'flash' : 'flash-off'}
                size={22}
                color={colors.white}
              />
            </Pressable>
            <Pressable>
              <Ionicons name="camera-reverse-outline" size={22} color={colors.white} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  headerRight: {
    width: 80,
    alignItems: 'flex-end',
  },
  planetInfoText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },

  /* Preview */
  previewContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.65,
    backgroundColor: colors.backgroundStrong,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Grid */
  gridSection: {
    flex: 1,
  },
  gridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  gridTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  gridDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gridDropdownText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  gridContent: {
    paddingBottom: 200,
  },
  gridRow: {
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },
  gridThumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    backgroundColor: colors.surface,
  },
  gridThumbSelected: {
    opacity: 0.7,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'flex-end',
    padding: 6,
  },
  selectedBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Camera Controls */
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingBottom: 36,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  /* Mode Toggle */
  modeToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingBottom: 12,
  },
  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modeButtonActive: {
    backgroundColor: colors.surfaceMuted,
  },
  modeText: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: '600',
  },
  modeTextActive: {
    color: colors.white,
  },

  /* Shutter Row */
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 32,
  },
  lastPhotoWrap: {
    width: 44,
    height: 44,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  lastPhotoThumb: {
    width: '100%',
    height: '100%',
  },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.white,
  },
  shutterInnerVideo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
  },
  cameraRight: {
    flexDirection: 'row',
    gap: 18,
    alignItems: 'center',
  },
});
