import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button } from "react-native-paper";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { useRouter } from "expo-router";
import { useFontSize } from '@/contexts/FontSizeContext';
import Slider from '@react-native-community/slider';
import { ThemedText } from '@/components/ThemedText'; // Import ThemedText
import { useContrast } from '@/contexts/ContrastContext';
import { getColors } from '@/constants/Colors';

const SettingsPage = () => {
  const [textToSpeech, setTextToSpeech] = useState(false);
  const router = useRouter();
  const { fontSize, setFontSize } = useFontSize();
  const { highContrastMode, setHighContrastMode } = useContrast();
  const colors = getColors(highContrastMode);

  const handleLogout = async () => {
    console.log("Logout");
    try {
      await FIREBASE_AUTH.signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Error during sign-out: ", error);
    }
  };

  const handleContrastToggle = (value: boolean) => {
    console.log('High Contrast Mode:', value); // Debug log
    setHighContrastMode(value);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.light.background }]}>
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>General</ThemedText>
        <TouchableOpacity style={[styles.row, { borderBottomColor: colors.light.icon }]} onPress={() => { }}>
          <ThemedText style={styles.rowText}>Theme</ThemedText>
          <ThemedText style={styles.rowText}>Auto</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Accessibility</ThemedText>
        <View style={styles.row}>
          <ThemedText style={styles.rowText}>Increase Contrast</ThemedText>
          <Switch
            value={highContrastMode}
            onValueChange={handleContrastToggle}
            accessibilityLabel="Toggle high contrast mode"
          />
        </View>
        <View style={styles.row}>
          <ThemedText style={styles.rowText}>Text-to-Speech</ThemedText>
          <Switch
            value={textToSpeech}
            onValueChange={setTextToSpeech}
            accessibilityLabel="Toggle text-to-speech"
          />
        </View>
        <View style={[styles.row, styles.textSizeRow]}>
          <ThemedText style={styles.rowText}>Text Size</ThemedText>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={12}
              maximumValue={24}
              step={1}
              value={fontSize}
              onValueChange={setFontSize}
            />
            <View style={styles.sliderLabels}>
              <ThemedText style={styles.sliderLabel}>Small</ThemedText>
              <ThemedText style={styles.sliderLabel}>Large</ThemedText>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Account</ThemedText>
        <TouchableOpacity style={styles.row} onPress={() => { }}>
          <ThemedText style={styles.rowText}>Edit Profile</ThemedText>
          <ThemedText style={styles.chevron}>›</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => { }}>
          <ThemedText style={styles.rowText}>Change Password</ThemedText>
          <ThemedText style={styles.chevron}>›</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Notifications</ThemedText>
        <TouchableOpacity style={styles.row} onPress={() => { }}>
          <ThemedText style={styles.rowText}>Preferences</ThemedText>
          <ThemedText style={styles.chevron}>›</ThemedText>
        </TouchableOpacity>
      </View>

      <Button
        mode="contained"
        style={styles.logoutButton}
        onPress={handleLogout}
        color={colors.light.tint}
      >
        <ThemedText style={{ color: '#fff' }}>Log Out</ThemedText>
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  rowText: {
    // fontSize removed as it will be handled by ThemedText
  },
  chevron: {
    // color will be set dynamically
  },
  logoutButton: {
    marginTop: 20,
  },
  sliderContainer: {
    flex: 1,
    marginLeft: 20,
    maxWidth: 200,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sliderLabel: {
    // color will be set dynamically
  },
  textSizeRow: {
    alignItems: 'center',
    paddingVertical: 16,
  },
});

export default SettingsPage;
