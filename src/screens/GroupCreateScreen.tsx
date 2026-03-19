/**
 * 역할: 새 그룹 생성에 필요한 입력 항목을 미리 배치해 두는 스켈레톤 폼 화면입니다.
 */
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/AppScreen';
import { InfoChip } from '../components/InfoChip';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../constants/colors';

export function GroupCreateScreen() {
  return (
    <AppScreen
      header={
        <ScreenHeader
          eyebrow="Create Group"
          title="함께 기록할 사람들을 위한 새 공간을 준비하세요"
          description="지금은 실제 생성 대신, 어떤 데이터를 받아야 하는지 이해할 수 있도록 폼 뼈대를 만듭니다."
        />
      }
    >
      <SectionCard title="기본 정보" description="실제 연결 시 groups 테이블 또는 컬렉션으로 저장될 항목입니다.">
        <Field label="그룹 이름" value="예: 우리 가족 앨범" />
        <Field label="설명" value="예: 여행과 일상을 함께 기록하는 공간" />
        <Field label="대표 분위기 문구" value="예: 오늘의 소중한 장면을 오래 간직해요" />
      </SectionCard>

      <SectionCard title="초대 설정" description="초대 코드와 공개 범위는 나중에 권한 구조와 연결됩니다.">
        <View style={styles.row}>
          <InfoChip label="Private Only" tone="primary" />
          <InfoChip label="초대 코드 자동 생성" tone="accent" />
        </View>
        <PrimaryButton label="그룹 생성 스켈레톤 완료" />
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
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
});
