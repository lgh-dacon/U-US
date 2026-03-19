/**
 * 역할: 초대 코드로 기존 그룹에 참여하는 흐름을 보여주는 화면입니다.
 */
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/AppScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../constants/colors';

export function GroupJoinScreen() {
  return (
    <AppScreen
      header={
        <ScreenHeader
          eyebrow="Join Group"
          title="초대 코드 하나로 우리만의 기록방에 참여하세요"
          description="실제 인증 전에도 어떤 입력과 검증이 필요한지 이해할 수 있게 단순한 구조로 두었습니다."
        />
      }
    >
      <SectionCard title="초대 코드 입력" description="나중에 inviteCode 또는 groupInvite 컬렉션 검증으로 연결됩니다.">
        <Text style={styles.input}>예: FAMILY-2026</Text>
        <PrimaryButton label="참여 가능한 그룹 미리보기" />
      </SectionCard>

      <SectionCard title="참여 후 보게 될 정보" description="진입 전에 어떤 그룹인지 최소한의 정보를 보여주면 이탈을 줄일 수 있습니다.">
        <Text style={styles.previewTitle}>우리 가족 앨범</Text>
        <Text style={styles.previewText}>멤버 5명, 최근 업로드 12개, 마지막 활동 오늘 오후 2:30</Text>
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
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
  previewTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  previewText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
