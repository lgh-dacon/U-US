import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../constants/colors';

type PrimaryButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  onPress?: () => void;
};

export function PrimaryButton({
  label,
  variant = 'primary',
  onPress,
}: PrimaryButtonProps) {
  const variantStyle =
    variant === 'primary' ? styles.primary : variant === 'secondary' ? styles.secondary : styles.ghost;

  return (
    <Pressable onPress={onPress} style={[styles.button, variantStyle]}>
      <Text style={[styles.label, variant === 'ghost' ? styles.ghostLabel : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    paddingHorizontal: 0,
  },
  label: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  ghostLabel: {
    color: colors.secondary,
  },
});
