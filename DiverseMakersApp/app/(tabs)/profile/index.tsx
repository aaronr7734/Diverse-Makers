import React, { useContext } from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { UserSettingsContext } from "../../../contexts/UserSettingsContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { useRouter } from "expo-router";

const UserProfileScreen: React.FC = () => {
  const { settings } = useContext(UserSettingsContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  if (!user) {
    return (
      <View
        style={[
          styles.centeredContainer,
          { backgroundColor: settings.highContrast ? "#000" : "#fff" },
        ]}
      >
        <Text
          style={[
            styles.errorText,
            {
              fontSize: settings.fontSize,
              color: settings.highContrast ? "#fff" : "#000",
            },
          ]}
          accessibilityRole="alert"
        >
          User not found.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: settings.highContrast ? "#000" : "#fff" },
      ]}
    >
      {/* Profile Image */}
      <Image
        source={require("../../assets/default-profile.png")} // Adjust the path as needed
        style={styles.profileImage}
        accessible
        accessibilityLabel="Profile Picture"
      />
      {/* Username */}
      <Text
        style={[
          styles.username,
          {
            fontSize: settings.fontSize + 4,
            color: settings.highContrast ? "#fff" : "#000",
          },
        ]}
        accessibilityRole="header"
      >
        {user.username || "No Username"}
      </Text>
      {/* Email */}
      <Text
        style={[
          styles.email,
          {
            fontSize: settings.fontSize,
            color: settings.highContrast ? "#fff" : "#555",
          },
        ]}
        accessibilityRole="text"
      >
        {user.email}
      </Text>
      {/* Disability Tags */}
      {user.disabilityTags && user.disabilityTags.length > 0 ? (
        <View style={styles.tagsContainer}>
          {user.disabilityTags.map((tag: string, index: number) => (
            <Text
              key={index}
              style={[
                styles.tag,
                {
                  fontSize: settings.fontSize - 2,
                  backgroundColor: settings.highContrast ? "#fff" : "#e0e0e0",
                  color: settings.highContrast ? "#000" : "#333",
                },
              ]}
              accessible
              accessibilityLabel={`Disability tag: ${tag}`}
            >
              {tag}
            </Text>
          ))}
        </View>
      ) : (
        <Text
          style={[
            styles.noTagsText,
            {
              fontSize: settings.fontSize - 2,
              color: settings.highContrast ? "#fff" : "#555",
            },
          ]}
          accessibilityRole="text"
        >
          No Disability Tags
        </Text>
      )}
      {/* Edit Profile Button */}
      <Pressable
        style={[
          styles.editButton,
          {
            backgroundColor: settings.highContrast ? "#fff" : "#6200ee",
            borderColor: settings.highContrast ? "#fff" : "#6200ee",
          },
        ]}
        onPress={() => router.push("/profile/edit")}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Edit Profile"
      >
        <Text
          style={{
            color: settings.highContrast ? "#000" : "#fff",
            fontSize: settings.fontSize,
            textAlign: "center",
            paddingVertical: 12,
          }}
        >
          Edit Profile
        </Text>
      </Pressable>
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    textAlign: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: "#6200ee",
  },
  username: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  email: {
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
    justifyContent: "center",
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    margin: 4,
  },
  noTagsText: {
    marginBottom: 24,
    textAlign: "center",
  },
  editButton: {
    width: "80%",
    borderRadius: 4,
    borderWidth: 1,
  },
});
