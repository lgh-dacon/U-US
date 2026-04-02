import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';

type InfoChipProps = {
  label: string;
  tone?: 'primary' | 'accent' | 'default';
};

export function InfoChip({ label, tone = 'default' }: InfoChipProps) {
  const chipStyle =
    tone === 'primary' ? styles.primaryChip : tone === 'accent' ? styles.accentChip : styles.defaultChip;
  const labelStyle =
    tone === 'primary' ? styles.primaryLabel : tone === 'accent' ? styles.accentLabel : styles.defaultLabel;

  return (
    <View style={[styles.chip, chipStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  defaultChip: {
    backgroundColor: colors.surfaceElevated,
  },
  primaryChip: {
    backgroundColor: colors.primarySoft,
  },
  accentChip: {
    backgroundColor: colors.accentSoft,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  defaultLabel: {
    color: colors.textMuted,
  },
  primaryLabel: {
    color: colors.white,
  },
  accentLabel: {
    color: colors.accent,
  },
});
