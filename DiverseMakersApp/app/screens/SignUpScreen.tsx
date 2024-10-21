import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Text, useTheme } from "react-native-paper";
import { signUp } from "../services/authService";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../RootNavigator";

type SignUpScreenProps = StackScreenProps<RootStackParamList, "SignUp">;

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      navigation.replace("Main");
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred";
      Alert.alert("Sign-Up Error", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <Text style={styles.title} accessibilityRole="header">
        Create an Account
      </Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        accessibilityLabel="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        style={styles.input}
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
        style={styles.input}
        returnKeyType="done"
        accessible
      />
      <Button
        mode="contained"
        onPress={handleSignUp}
        accessibilityLabel="Sign Up"
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={{ color: "#fff" }}
        accessible
      >
        Sign Up
      </Button>
      <Button
        onPress={() => navigation.navigate("Login")}
        accessibilityLabel="Already have an account? Login"
        style={styles.link}
        labelStyle={{ color: theme.colors.primary }}
        accessible
      >
        Already have an account? Login
      </Button>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // Same styles as LoginScreen
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
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    marginVertical: 12,
  },
  buttonContent: {
    height: 48,
  },
  link: {
    alignSelf: "center",
  },
});

export default SignUpScreen;
