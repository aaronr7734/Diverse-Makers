import React, { useContext } from "react";
import { Stack } from "expo-router";
import { UserSettingsContext } from "../../../contexts/UserSettingsContext";

export default function SearchLayout() {
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
                    headerTitle: "Search Activities",
                }}
            />
        </Stack>
    );
}

