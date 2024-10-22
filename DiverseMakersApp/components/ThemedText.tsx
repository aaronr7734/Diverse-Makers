import { Text, type TextProps, StyleSheet } from 'react-native';

import { useFontSize } from '@/contexts/FontSizeContext';
import { useContrast } from '@/contexts/ContrastContext';
import { getColors } from '@/constants/Colors';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const { fontSize } = useFontSize();
  const { highContrastMode } = useContrast();
  const colors = getColors(highContrastMode);

  const getAdjustedFontSize = (baseSize: number) => {
    return baseSize * (fontSize / 16);
  };

  const styles = StyleSheet.create({
    default: {
      fontSize: getAdjustedFontSize(16),
      lineHeight: getAdjustedFontSize(24),
      color: colors.light.text,
    },
    defaultSemiBold: {
      fontSize: getAdjustedFontSize(16),
      lineHeight: getAdjustedFontSize(24),
      fontWeight: '600',
      color: colors.light.text,
    },
    title: {
      fontSize: getAdjustedFontSize(32),
      fontWeight: 'bold',
      lineHeight: getAdjustedFontSize(32),
      color: colors.light.text,
    },
    subtitle: {
      fontSize: getAdjustedFontSize(20),
      fontWeight: 'bold',
      color: colors.light.text,
    },
    link: {
      lineHeight: getAdjustedFontSize(30),
      fontSize: getAdjustedFontSize(16),
      color: colors.light.tint,
    },
  });

  return (
    <Text
      style={[
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}
