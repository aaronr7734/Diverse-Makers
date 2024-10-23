import React, { useContext } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
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
    // Announce high contrast mode change
    // This can stay if it's working, otherwise we can use accessibilityLiveRegion
  };

  return (
    <SafeAreaView 
      style={[
        styles.safeArea,
        { backgroundColor: settings.highContrast ? "#000" : "#fff" }
      ]}
    >
      {/* Main container for the settings screen */}
      <View style={styles.container}>
        <Text
          style={[
            styles.title,
            {
              fontSize: settings.fontSize + 8,
              color: settings.highContrast ? "#fff" : "#000",
            },
          ]}
          accessibilityRole="header"
        >
          Settings
        </Text>

        {/* Font Size Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: settings.fontSize + 2,
                color: settings.highContrast ? "#fff" : "#000",
              },
            ]}
          >
            Font Size
          </Text>
          
          {/* Increase or decrease font size */}
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
            
            {/* Display for current font size */}
            <View style={styles.fontSizeDisplayContainer}>
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
                {settings.fontSize}
              </Text>
            </View>

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

        {/* High Contrast Section */}
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <Text
              style={[
                styles.settingLabel,
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
  },
  section: {
    marginBottom: 32,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 16,
  },
  fontSizeControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  fontSizeButton: {
    borderRadius: 8,
    flex: 1,
  },
  fontSizeDisplayContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 12,
    minWidth: 60,
    alignItems: "center",
  },
  fontSizeDisplay: {
    fontWeight: "600",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    flex: 1,
    marginRight: 16,
  },
});

export default SettingsScreen;
