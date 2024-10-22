import React, { useContext, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button } from "react-native-paper";
import { AuthContext } from "../contexts/AuthContext";
import { UserSettingsContext } from "../contexts/UserSettingsContext";
import { Link, useRouter } from "expo-router";

const WelcomeScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { settings } = useContext(UserSettingsContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/home");
    }
  }, [user]);

  if (user) {
    return null;
  } else {
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: settings.highContrast ? "#000" : "#fff",
      },
      title: {
        textAlign: "center",
        marginBottom: 24,
        fontWeight: "bold",
        color: settings.highContrast ? "#fff" : "#6200ee",
      },
      subtitle: {
        textAlign: "center",
        marginBottom: 24,
        color: settings.highContrast ? "#fff" : "#555",
      },
      logo: {
        width: 150,
        height: 150,
        marginBottom: 24,
        resizeMode: "contain",
      },
      buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        paddingHorizontal: 16,
      },
      button: {
        flex: 1,
        marginHorizontal: 8,
        borderRadius: 4,
      },
      buttonContent: {
        height: 48,
        justifyContent: "center",
      },
    });

    return (
      <View style={styles.container}>
        <Text
          style={[styles.title, { fontSize: settings.fontSize + 4 }]}
          accessibilityRole="header"
        >
          Welcome to Diverse Makers!
        </Text>

        <Image
          source={require("./assets/logo.png")}
          style={styles.logo}
          accessible
          accessibilityLabel="Diverse Makers Logo"
        />
        <Text
          style={[styles.subtitle, { fontSize: settings.fontSize }]}
          accessibilityRole="text"
        >
          If you already have an account, please sign in. Otherwise, sign up to
          start exploring!
        </Text>
        <View style={styles.buttonContainer}>
          <Link href="/login" asChild>
            <Button
              mode="contained"
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={{
                color: settings.highContrast ? "#000" : "#fff",
                fontSize: settings.fontSize,
              }}
              accessible
              accessibilityLabel="Sign In"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signUp" asChild>
            <Button
              mode="outlined"
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={{
                color: settings.highContrast ? "#fff" : "#6200ee",
                fontSize: settings.fontSize,
              }}
              accessible
              accessibilityLabel="Sign Up"
            >
              Sign Up
            </Button>
          </Link>
        </View>
      </View>
    );
  }
};

export default WelcomeScreen;
