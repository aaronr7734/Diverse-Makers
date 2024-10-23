import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack initialRouteName="login" screenOptions={{ headerShown: false }}> {/* <= important! */}
      <Stack.Screen name="signUp" />
      <Stack.Screen name="login" />
    </Stack>
  );
}