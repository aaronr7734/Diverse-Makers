/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';  // Blue accent color

// Regular colors (Light theme with sufficient contrast)
const regularColors = {
  light: {
    text: '#6B7280',          // Lighter gray (still maintaining readability)
    background: '#FFFFFF',     // Keeping white background
    tint: '#38BEF8',          // Lighter blue for more dramatic effect
    icon: '#9CA3AF',          // Lighter medium gray
    tabIconDefault: '#9CA3AF', // Lighter medium gray
    tabIconSelected: '#38BEF8' // Lighter blue accent
  },
  dark: {
    text: '#2D3748',          // Keeping consistent with light theme
    background: '#F5F7FA',     // Keeping consistent with light theme
    tint: '#0A7EA4',          // Keeping consistent with light theme
    icon: '#4A5568',          // Keeping consistent with light theme
    tabIconDefault: '#4A5568', // Keeping consistent with light theme
    tabIconSelected: '#0A7EA4' // Keeping consistent with light theme
  }
};

// High contrast colors (Darker text and elements for enhanced readability)
const highContrastColors = {
  light: {
    text: '#000000',          // Pure black (contrast ratio with white bg: 21:1)
    background: '#F0F0F0',     // Light gray background for more contrast
    tint: '#003B66',          // Much darker blue (contrast ratio: 10:1)
    icon: '#1A1A1A',          // Very dark gray (contrast ratio: 18:1)
    tabIconDefault: '#1A1A1A', // Very dark gray
    tabIconSelected: '#003B66' // Much darker blue
  },
  dark: {
    text: '#000000',          // Keeping consistent dark text
    background: '#FFFFFF',     // Keeping consistent white background
    tint: '#005B99',          // Keeping consistent darker blue
    icon: '#000000',          // Keeping consistent black
    tabIconDefault: '#000000', // Keeping consistent black
    tabIconSelected: '#005B99' // Keeping consistent darker blue
  }
};

export const getColors = (isHighContrast: boolean) => {
  return isHighContrast ? highContrastColors : regularColors;
};
