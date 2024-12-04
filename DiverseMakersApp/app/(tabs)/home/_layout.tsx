import React, { useContext } from "react";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserSettingsContext } from "../../../contexts/UserSettingsContext";
import { useRouter } from "expo-router";

export default function HomeLayout() {
  const { settings } = useContext(UserSettingsContext);
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: settings.highContrast ? "#000" : "#fff",
        },
        headerTitleStyle: {
          color: settings.highContrast ? "#fff" : "#000",
          fontSize: settings.fontSize + 4,
        },
        headerTintColor: settings.highContrast ? "#fff" : "#000",
        
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "STEM Activities",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/home/newActivity")}
              accessible
              accessibilityLabel="Add new activity"
              accessibilityHint="Navigates to the new activity creation screen"
              style={{ marginRight: 16 }}
            >
              <Ionicons
                name="add"
                size={28}
                color={settings.highContrast ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          ),
        }}
      />
      {/* Define other screens without specific options */}
    </Stack>
  );
}
