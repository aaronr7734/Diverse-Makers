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
import { FIREBASE_AUTH } from "../firebaseConfig";
import { useRouter } from "expo-router"; // Import useRouter

const SettingsPage = () => {
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);
  const router = useRouter(); // Initialize router

  const handleLogout = async () => {
    console.log("Logout");
    try {
      await FIREBASE_AUTH.signOut();
      // Navigate to the Login screen
      router.replace("/login"); // Navigate to the login screen
    } catch (error) {
      console.error("Error during sign-out: ", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <TouchableOpacity style={styles.row} onPress={() => {}}>
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
            onValueChange={setHighContrastMode}
            accessibilityLabel="Toggle high contrast mode"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Text-to-Speech</Text>
          <Switch
            value={textToSpeech}
            onValueChange={setTextToSpeech}
            accessibilityLabel="Toggle text-to-speech"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Text style={styles.rowText}>Edit Profile</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Text style={styles.rowText}>Change Password</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <TouchableOpacity style={styles.row} onPress={() => {}}>
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
