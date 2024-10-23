import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { UserSettingsContext } from "../../../contexts/UserSettingsContext";

const MakerspacesScreen: React.FC = () => {
  const { settings } = useContext(UserSettingsContext);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: settings.highContrast ? "#000" : "#fff",
        },
      ]}
    >
      <Text
        style={[
          styles.placeholderText,
          {
            color: settings.highContrast ? "#fff" : "#000",
            fontSize: settings.fontSize + 2,
          },
        ]}
      >
        Makerspace Finder
      </Text>
      <Text
        style={[
          styles.subText,
          {
            color: settings.highContrast ? "#ccc" : "#666",
            fontSize: settings.fontSize,
          },
        ]}
      >
        Find local makerspaces and community workshops in your area.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  placeholderText: {
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subText: {
    textAlign: "center",
  },
});

export default MakerspacesScreen;
