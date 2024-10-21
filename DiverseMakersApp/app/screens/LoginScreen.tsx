import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { signIn } from "../services/authService";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../RootNavigator";
import { UserSettingsContext } from "../contexts/UserSettingsContext";

type LoginScreenProps = StackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { settings } = useContext(UserSettingsContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const user = await signIn(email, password);
      if (user) {
        // Navigate to MainTabNavigator after successful login
        navigation.replace("Main", { user });
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred";
      Alert.alert("Login Error", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <Text
        style={[styles.title, { fontSize: settings.fontSize + 4 }]}
        accessibilityRole="header"
      >
        Welcome Back
      </Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        accessibilityLabel="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        style={[styles.input, { fontSize: settings.fontSize }]}
        returnKeyType="next"
        accessible
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        accessibilityLabel="Password"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
        style={[styles.input, { fontSize: settings.fontSize }]}
        returnKeyType="done"
        accessible
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        accessibilityLabel="Login"
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={{ color: "#fff", fontSize: settings.fontSize }}
        accessible
      >
        Login
      </Button>
      <Button
        onPress={() => navigation.navigate("SignUp")}
        accessibilityLabel="Don't have an account? Sign Up"
        style={styles.link}
        labelStyle={{ color: "#6200ee", fontSize: settings.fontSize - 2 }}
        accessible
      >
        Don't have an account? Sign Up
      </Button>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: "center",
    color: "#000",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  button: {
    marginVertical: 12,
    borderRadius: 4,
  },
  buttonContent: {
    height: 48,
    justifyContent: "center",
  },
  link: {
    alignSelf: "center",
  },
});

export default LoginScreen;
