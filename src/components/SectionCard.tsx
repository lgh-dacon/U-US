import { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';

type SectionCardProps = PropsWithChildren<{
  title: string;
  description?: string;
  right?: ReactNode;
}>;

export function SectionCard({ children, title, description, right }: SectionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
        {right}
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    gap: 14,
    shadowColor: colors.black,
    shadowOpacity: 0.24,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  description: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  body: {
    gap: 12,
  },
});
