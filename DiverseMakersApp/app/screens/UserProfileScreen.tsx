import React, { useContext } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button } from "react-native-paper";
import User from "../models/User";
import { UserSettingsContext } from "../contexts/UserSettingsContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../RootNavigator";

type EditProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EditProfile"
>;

const UserProfileScreen: React.FC<{ user: User }> = ({ user }) => {
  const { settings } = useContext(UserSettingsContext);
  const navigation = useNavigation<EditProfileScreenNavigationProp>();

  const handleEditProfile = () => {
    navigation.navigate("EditProfile", { user });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: settings.highContrast ? "#000" : "#fff" },
      ]}
    >
      {/* Profile Image */}
      <Image
        source={require("../assets/default-profile.png")} // Currently set to Diverse Makers logo.
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
      >
        {user.email}
      </Text>
      {/* Disability Tags */}
      {user.disabilityTags && user.disabilityTags.length > 0 ? (
        <View style={styles.tagsContainer}>
          {user.disabilityTags.map((tag, index) => (
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
        >
          No Disability Tags
        </Text>
      )}
      {/* Edit Profile Button */}
      <Button
        mode="contained"
        onPress={handleEditProfile}
        style={[
          styles.editButton,
          { backgroundColor: settings.highContrast ? "#fff" : "#6200ee" },
        ]}
        contentStyle={{ height: 48 }}
        labelStyle={{
          color: settings.highContrast ? "#000" : "#fff",
          fontSize: settings.fontSize,
        }}
        accessible
        accessibilityLabel="Edit Profile"
      >
        Edit Profile
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: "#6200ee",
    // Optional Shadow for better visibility
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
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
    borderColor: "#6200ee",
  },
});

export default UserProfileScreen;
