import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { FIREBASE_AUTH } from "./firebaseConfig";  // Import Firebase authentication
import { onAuthStateChanged } from "firebase/auth";  // Firebase method to listen to auth changes
import { View, ActivityIndicator, Text } from "react-native";

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

  if (isAuthenticated === null) {
    // While waiting for Firebase to check authentication, show a loading indicator
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Checking Authentication...</Text>
      </View>
    );
  }

  return (
    <Stack>
      {isAuthenticated ? (
        // If the user is authenticated, show the main app (e.g., the tab layout)
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        // If not authenticated, redirect to the login screen
        <Stack.Screen name="login" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
