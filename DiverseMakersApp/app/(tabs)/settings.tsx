import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Switch, useTheme, Button } from "react-native-paper";
import { UserSettingsContext } from "../../contexts/UserSettingsContext";

const SettingsScreen: React.FC = () => {
  const { settings, updateSettings } = useContext(UserSettingsContext);
  const theme = useTheme();

  const increaseFontSize = () => {
    if (settings.fontSize < 24) {
      const newFontSize = settings.fontSize + 1;
      updateSettings({ fontSize: newFontSize });
    }
  };

  const decreaseFontSize = () => {
    if (settings.fontSize > 12) {
      const newFontSize = settings.fontSize - 1;
      updateSettings({ fontSize: newFontSize });
    }
  };

  const toggleHighContrast = (value: boolean) => {
    updateSettings({ highContrast: value });
    const mode = value ? "on" : "off";
    // Announce high contrast mode change
    // This can stay if it's working, otherwise we can use accessibilityLiveRegion
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: settings.highContrast ? "#000" : "#fff" },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            fontSize: settings.fontSize + 4,
            color: settings.highContrast ? "#fff" : "#000",
          },
        ]}
        accessibilityRole="header"
      >
        Settings
      </Text>

      {/* Font Size Adjustment */}
      <View style={styles.settingItem}>
        <Text
          style={[
            styles.label,
            {
              fontSize: settings.fontSize,
              color: settings.highContrast ? "#fff" : "#000",
            },
          ]}
        >
          Font Size
        </Text>
        <View style={styles.fontSizeControls}>
          <Button
            mode="contained"
            onPress={decreaseFontSize}
            disabled={settings.fontSize <= 12}
            accessibilityLabel="Decrease font size"
            accessibilityHint="Decreases the font size by one"
            style={styles.fontSizeButton}
            labelStyle={{
              color: settings.highContrast ? "#000" : "#fff",
              fontSize: settings.fontSize,
            }}
          >
            A-
          </Button>
          <Text
            style={[
              styles.fontSizeDisplay,
              {
                fontSize: settings.fontSize,
                color: settings.highContrast ? "#fff" : "#000",
              },
            ]}
            accessibilityLiveRegion="assertive"
            accessible
          >
            {`Font size ${settings.fontSize}`}
          </Text>
          <Button
            mode="contained"
            onPress={increaseFontSize}
            disabled={settings.fontSize >= 24}
            accessibilityLabel="Increase font size"
            accessibilityHint="Increases the font size by one"
            style={styles.fontSizeButton}
            labelStyle={{
              color: settings.highContrast ? "#000" : "#fff",
              fontSize: settings.fontSize,
            }}
          >
            A+
          </Button>
        </View>
      </View>

      {/* High Contrast Mode */}
      <View style={styles.settingItem}>
        <Text
          style={[
            styles.label,
            {
              fontSize: settings.fontSize,
              color: settings.highContrast ? "#fff" : "#000",
            },
          ]}
        >
          High Contrast Mode
        </Text>
        <Switch
          value={settings.highContrast}
          onValueChange={toggleHighContrast}
          color={theme.colors.primary}
          accessibilityLabel="Toggle high contrast mode"
          accessibilityRole="switch"
          accessibilityState={{ checked: settings.highContrast }}
        />
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
  },
  settingItem: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
  },
  fontSizeControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  fontSizeButton: {
    marginHorizontal: 8,
    borderRadius: 4,
  },
  fontSizeDisplay: {
    minWidth: 80,
    textAlign: "center",
  },
});
