import React, { useState, useContext } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View,
  AccessibilityInfo,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  useTheme,
  HelperText,
} from "react-native-paper";
import { signIn } from "../../services/authService";
import { UserSettingsContext } from "../../contexts/UserSettingsContext";
import { Link } from "expo-router";
import authStyles from "../styles/authStyles";

const LoginScreen: React.FC = () => {
  const { settings } = useContext(UserSettingsContext);
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Reset error messages
    setEmailError(null);
    setPasswordError(null);
    setGeneralError(null);

    // Input validation
    let valid = true;

    if (!email.trim()) {
      const message = "Email is required.";
      setEmailError(message);
      AccessibilityInfo.announceForAccessibility(message);
      valid = false;
    } else if (!validateEmail(email)) {
      const message = "Please enter a valid email address.";
      setEmailError(message);
      AccessibilityInfo.announceForAccessibility(message);
      valid = false;
    }

    if (!password) {
      const message = "Password is required.";
      setPasswordError(message);
      AccessibilityInfo.announceForAccessibility(message);
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      setLoading(true);
      await signIn(email.trim(), password);
      // Authentication state will change, and AuthContext will handle navigation
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred.";
      setGeneralError(errorMessage);
      // Announce the error message
      AccessibilityInfo.announceForAccessibility(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={authStyles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <Text
        style={[authStyles.title, { fontSize: settings.fontSize + 4 }]}
        accessibilityRole="header"
      >
        Welcome Back
      </Text>

      {generalError ? (
        <Text
          style={authStyles.errorText}
          accessibilityLiveRegion="assertive"
          accessibilityRole="alert"
        >
          {generalError}
        </Text>
      ) : null}

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        accessibilityLabel="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        style={[authStyles.input, { fontSize: settings.fontSize }]}
        returnKeyType="next"
        error={!!emailError}
        accessible
      />
      {emailError ? (
        <HelperText
          type="error"
          visible={!!emailError}
          accessibilityLiveRegion="assertive"
          accessibilityRole="alert"
        >
          {emailError}
        </HelperText>
      ) : null}

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        accessibilityLabel="Password"
        secureTextEntry={!passwordVisible}
        autoCapitalize="none"
        autoComplete="password"
        style={[authStyles.input, { fontSize: settings.fontSize }]}
        returnKeyType="done"
        error={!!passwordError}
        right={
          <TextInput.Icon
            icon={passwordVisible ? "eye-off" : "eye"}
            onPress={() => setPasswordVisible(!passwordVisible)}
            accessibilityLabel={
              passwordVisible ? "Hide password" : "Show password"
            }
          />
        }
        accessible
      />
      {passwordError ? (
        <HelperText
          type="error"
          visible={!!passwordError}
          accessibilityLiveRegion="assertive"
          accessibilityRole="alert"
        >
          {passwordError}
        </HelperText>
      ) : null}

      <Button
        mode="contained"
        onPress={handleLogin}
        accessibilityLabel="Login"
        style={authStyles.button}
        contentStyle={authStyles.buttonContent}
        labelStyle={{
          color: theme.colors.onPrimary,
          fontSize: settings.fontSize,
        }}
        loading={loading}
        disabled={loading}
        accessible
      >
        Login
      </Button>

      <Link href="/signUp" asChild>
        <Button
          accessibilityLabel="Don't have an account? Sign up"
          style={authStyles.link}
          labelStyle={{
            color: theme.colors.primary,
            fontSize: settings.fontSize - 2,
          }}
          contentStyle={{ justifyContent: "center" }}
          accessible
        >
          Don't have an account? Sign up
        </Button>
      </Link>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
