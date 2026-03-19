/**
 * 역할: 사진과 영상 업로드 화면의 구조를 먼저 만들어 두고, 나중에 실제 업로더를 연결할 수 있게 하는 화면입니다.
 */
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/AppScreen';
import { InfoChip } from '../components/InfoChip';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../constants/colors';

export function UploadScreen() {
  return (
    <AppScreen
      header={
        <ScreenHeader
          eyebrow="Upload Memory"
          title="사진과 영상을 올릴 자리를 먼저 준비합니다"
          description="실제 이미지 선택기나 스토리지는 아직 붙이지 않고, 어떤 데이터가 필요한지만 보이게 설계합니다."
        />
      }
    >
      <SectionCard title="업로드 영역" description="나중에 Expo Image Picker와 스토리지 업로드 로직을 연결할 자리입니다.">
        <View style={styles.dropzone}>
          <Text style={styles.dropzoneTitle}>미디어 선택 Placeholder</Text>
          <Text style={styles.dropzoneText}>사진 여러 장 또는 짧은 영상을 선택할 수 있는 영역</Text>
        </View>
        <View style={styles.row}>
          <InfoChip label="사진 6장" tone="primary" />
          <InfoChip label="영상 1개 가능" tone="accent" />
        </View>
      </SectionCard>

      <SectionCard title="게시글 정보" description="업로드 후 posts 테이블 또는 컬렉션에 저장될 입력값입니다.">
        <Field label="제목" value="벚꽃 아래 첫 가족 사진" />
        <Field label="본문" value="그날의 감정과 상황을 짧게 적는 자리" />
        <Field label="위치" value="서울숲" />
        <PrimaryButton label="업로드 흐름 저장 버튼" />
      </SectionCard>
    </AppScreen>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.input}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dropzone: {
    height: 180,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  dropzoneTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  dropzoneText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  field: {
    gap: 8,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.textMuted,
    fontSize: 14,
  },
});
