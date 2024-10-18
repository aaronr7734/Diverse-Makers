import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { signIn, signUp } from "./services/authService";
import { useRouter } from "expo-router"; // Import useRouter from expo-router

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter(); // Initialize router

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await signIn(email, password);
      console.log("Logged in:", response.user.uid);

      // Navigate to the tabs after successful login
      router.replace('/(tabs)'); // Use router.replace for navigation
    } catch (error: any) {
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await signUp(email, password);
      alert("Account created successfully!");

      // Optionally, navigate to the tabs after sign-up
      router.replace('/(tabs)'); // Use router.replace for navigation
    } catch (error: any) {
      alert("Sign up failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          value={password}
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Button onPress={handleSignIn}>Log In</Button>
            <Button onPress={handleSignUp}>Sign Up</Button>
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
});
