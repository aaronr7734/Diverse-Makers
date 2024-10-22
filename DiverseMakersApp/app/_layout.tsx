import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { FIREBASE_AUTH } from "./firebaseConfig";  // Import Firebase authentication
import { onAuthStateChanged } from "firebase/auth";  // Firebase method to listen to auth changes
import { View, ActivityIndicator } from "react-native";
import { FontSizeProvider } from '@/contexts/FontSizeContext';
import { ContrastProvider } from '@/contexts/ContrastContext';
import { ThemedText } from '@/components/ThemedText'; // Import ThemedText

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    console.log("Checking Firebase Auth state...");

    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        // User is signed in
        console.log("User signed in: ", user);
        setIsAuthenticated(true);
      } else {
        // User is signed out
        console.log("User signed out");
        setIsAuthenticated(false);
      }
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  // Wrap the loading state in both providers
  if (isAuthenticated === null) {
    return (
      <ContrastProvider>
        <FontSizeProvider>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <ThemedText>Checking Authentication...</ThemedText>
          </View>
        </FontSizeProvider>
      </ContrastProvider>
    );
  }

  return (
    <ContrastProvider>
      <FontSizeProvider>
        <Stack>
          {isAuthenticated ? (
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="login" options={{ headerShown: false }} />
          )}
        </Stack>
      </FontSizeProvider>
    </ContrastProvider>
  );
}
