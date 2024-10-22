import React, { useEffect } from "react";
import { Stack, useRouter, usePathname } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { UserSettingsProvider } from "../contexts/UserSettingsContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <UserSettingsProvider>
        <RootNavigator />
      </UserSettingsProvider>
    </AuthProvider>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const authRoutes = ["/", "/login", "/signUp"];
    const inAuthGroup = authRoutes.includes(pathname);

    if (!user && inAuthGroup) {
      return;
    }

    if (!user && !inAuthGroup) {
      router.replace("/");
    } else if (user && inAuthGroup && pathname !== "/") {
      router.replace("/home");
    }
  }, [user, loading, pathname]);

  return (
    <Stack>
      {/* Public routes */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      {/* Authenticated routes */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
