import { Text, type TextProps, StyleSheet } from 'react-native';

import { useFontSize } from '@/contexts/FontSizeContext';

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

  const getAdjustedFontSize = (baseSize: number) => {
    return baseSize * (fontSize / 16); // Scale relative to default size
  };

  const styles = StyleSheet.create({
    default: {
      fontSize: getAdjustedFontSize(16),
      lineHeight: getAdjustedFontSize(24),
      color: '#000000', // Set default color to black
    },
    defaultSemiBold: {
      fontSize: getAdjustedFontSize(16),
      lineHeight: getAdjustedFontSize(24),
      fontWeight: '600',
      color: '#000000',
    },
    title: {
      fontSize: getAdjustedFontSize(32),
      fontWeight: 'bold',
      lineHeight: getAdjustedFontSize(32),
      color: '#000000',
    },
    subtitle: {
      fontSize: getAdjustedFontSize(20),
      fontWeight: 'bold',
      color: '#000000',
    },
    link: {
      lineHeight: getAdjustedFontSize(30),
      fontSize: getAdjustedFontSize(16),
      color: '#0a7ea4', // Keep link color blue
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
