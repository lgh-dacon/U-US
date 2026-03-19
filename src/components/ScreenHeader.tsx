import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';

type ScreenHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function ScreenHeader({ eyebrow, title, description }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginBottom: 4,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
  },
  description: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
  },
});
