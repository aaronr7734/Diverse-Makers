import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button } from "react-native-paper";

const SettingsPage = () => {
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);

  const handleThemeChange = () => {
    // TODO: Handle changing the theme
    console.log("Theme change requested");
  };

  const handleHighContrastToggle = (value) => {
    setHighContrastMode(value);
    // TODO: Implement high contrast
    console.log("High contrast mode activated:", value);
  };

  const handleTextToSpeechToggle = (value) => {
    setTextToSpeech(value);
    // TODO: Implement text-to-speech
    console.log("Text-to-speech activated:", value);
  };

  const handleEditProfile = () => {
    // TODO: Handle editing your profile
    console.log("Go to Edit Profile");
  };

  const handleChangePassword = () => {
    // TODO: Handle chanigng password
    console.log("Go to Change Password");
  };

  const handleNotificationPreferences = () => {
    // TODO: Navigate to Notification Preferences
    console.log("Open Notification Preferences");
  };

  const handleLogout = () => {
    // TODO: Log out
    console.log("Logout");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <TouchableOpacity style={styles.row} onPress={handleThemeChange}>
          <Text style={styles.rowText}>Theme</Text>
          <Text style={styles.rowText}>Auto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accessibility</Text>
        <View style={styles.row}>
          <Text style={styles.rowText}>High Contrast Mode</Text>
          <Switch
            value={highContrastMode}
            onValueChange={handleHighContrastToggle}
            accessibilityLabel="Toggle high contrast mode"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Text-to-Speech</Text>
          <Switch
            value={textToSpeech}
            onValueChange={handleTextToSpeechToggle}
            accessibilityLabel="Toggle text-to-speech"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.row} onPress={handleEditProfile}>
          <Text style={styles.rowText}>Edit Profile</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={handleChangePassword}>
          <Text style={styles.rowText}>Change Password</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <TouchableOpacity style={styles.row} onPress={handleNotificationPreferences}>
          <Text style={styles.rowText}>Preferences</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" style={styles.logoutButton} onPress={handleLogout}>
        Log Out
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  rowText: {
    fontSize: 16,
  },
  chevron: {
    fontSize: 20,
    color: "#888",
  },
  logoutButton: {
    marginTop: 20,
  },
});

export default SettingsPage;