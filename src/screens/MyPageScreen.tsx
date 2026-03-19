/**
 * 역할: 내 프로필과 개발용 구조 가이드를 함께 보여주는 마이페이지 화면입니다.
 */
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../components/AppScreen';
import { InfoChip } from '../components/InfoChip';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../constants/colors';
import { useAppData } from '../context/AppDataProvider';
import { dataSourceConfig } from '../services/dataSource';

export function MyPageScreen() {
  const { currentUser, screenRequirements } = useAppData();

  return (
    <AppScreen
      header={
        <ScreenHeader
          eyebrow="My Page"
          title={`${currentUser.name}님의 기록 설정`}
          description="사용자 프로필뿐 아니라, 초보자가 프로젝트 구조를 이해할 수 있도록 데이터 연결 포인트도 같이 보여줍니다."
        />
      }
    >
      <SectionCard title="내 정보" description={currentUser.bio}>
        <View style={styles.row}>
          <InfoChip label={currentUser.roleLabel} tone="primary" />
          <InfoChip label={`추억 ${currentUser.memoryCount}개`} />
          <InfoChip label={`가입 ${currentUser.joinedAt}`} tone="accent" />
        </View>
      </SectionCard>

      <SectionCard title="데이터 연결 방식" description="지금은 mock, 나중에는 provider만 바꾸는 구조를 목표로 설계했습니다.">
        <Text style={styles.body}>현재 provider: {dataSourceConfig.activeProvider}</Text>
        <Text style={styles.body}>mock: {dataSourceConfig.notes.mock}</Text>
        <Text style={styles.body}>supabase: {dataSourceConfig.notes.supabase}</Text>
        <Text style={styles.body}>firebase: {dataSourceConfig.notes.firebase}</Text>
      </SectionCard>

      <SectionCard title="화면별 필요한 데이터" description="어떤 화면에 어떤 데이터가 필요한지 미리 적어두면 나중에 백엔드를 붙일 때 훨씬 수월합니다.">
        {screenRequirements.map((item) => (
          <View key={item.screen} style={styles.requirementCard}>
            <Text style={styles.requirementTitle}>{item.screen}</Text>
            <Text style={styles.body}>{item.purpose}</Text>
            <Text style={styles.caption}>필요 필드: {item.requiredFields.join(', ')}</Text>
          </View>
        ))}
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  body: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
  caption: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  requirementCard: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    gap: 6,
  },
  requirementTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
});
