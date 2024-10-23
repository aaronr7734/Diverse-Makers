import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      initialRouteName="login"
      screenOptions={{
        headerShown: false,
        title: undefined, // Ensures clean navigation stack
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
        }}
      />
      <Stack.Screen
        name="signUp"
        options={{
          title: "Sign Up",
        }}
      />
    </Stack>
  );
}
