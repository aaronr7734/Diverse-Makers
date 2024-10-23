import React, { useContext } from "react";
import { Stack } from "expo-router";
import { UserSettingsContext } from "../../../contexts/UserSettingsContext";

// types.ts (or in the same file as your component)
export type RootStackParamList = {
  Makerspaces: undefined; // No parameters
  MakerspaceDetails: {
    makerspace: {
      name: string;
      description: string;
      image: string;
      contactEmail: string;
      contactPhone: string;
      contactAddress: string;
    };
  };
};


export default function MakerspacesLayout() {
  const { settings } = useContext(UserSettingsContext);

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
          headerTitle: "Local Makerspaces",
        }}
      />
      <Stack.Screen
        name="MakerspaceDetails" // Ensure this matches your screen name
        options={{
          headerTitle: "Makerspace Details",
        }}
      />
    </Stack>
  );
}
