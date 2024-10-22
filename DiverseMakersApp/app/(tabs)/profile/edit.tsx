import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { TextInput, Text } from "react-native-paper";
import { UserSettingsContext } from "../../../contexts/UserSettingsContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { FIREBASE_DB } from "../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import User from "../../models/User";

const EditProfileScreen: React.FC = () => {
  const { settings } = useContext(UserSettingsContext);
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setTags(user.disabilityTags || []);
    }
  }, [user]);

  const handleAddTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert("Validation Error", "Username cannot be empty.");
      return;
    }

    try {
      if (!user) {
        Alert.alert("Error", "User not found.");
        return;
      }

      // Prepare updated fields
      const updatedFields: {
        username: string;
        disabilityTags: string[];
      } = {
        username: username.trim(),
        disabilityTags: tags,
      };

      // Update Firestore
      const userDocRef = doc(FIREBASE_DB, "users", user.userId);
      await updateDoc(userDocRef, updatedFields);

      // Create a new User instance with the updated fields
      const updatedUser = new User({
        userId: user.userId,
        email: user.email,
        createdAt: user.createdAt,
        username: updatedFields.username,
        disabilityTags: updatedFields.disabilityTags,
      });

      // Update user in AuthContext
      setUser(updatedUser);

      Alert.alert("Success", "Profile updated successfully!");
      router.replace("/profile"); // Navigate back to the profile screen
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: settings.highContrast ? "#000" : "#fff" },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={[
            styles.title,
            {
              fontSize: settings.fontSize + 4,
              color: settings.highContrast ? "#fff" : "#6200ee",
            },
          ]}
          accessibilityRole="header"
        >
          Edit Profile
        </Text>
        {/* Username Input */}
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={[
            styles.input,
            {
              backgroundColor: settings.highContrast ? "#000" : "#fff",
            },
          ]}
          placeholder="Enter your username"
          placeholderTextColor={settings.highContrast ? "#fff" : "#aaa"}
          accessible
          accessibilityLabel="Username Input"
          theme={{
            colors: {
              text: settings.highContrast ? "#fff" : "#000",
              placeholder: settings.highContrast ? "#fff" : "#aaa",
            },
          }}
        />
        {/* Disability Tags Input */}
        <TextInput
          label="Add Disability Tag"
          value={currentTag}
          onChangeText={setCurrentTag}
          style={[
            styles.input,
            {
              backgroundColor: settings.highContrast ? "#000" : "#fff",
            },
          ]}
          placeholder="e.g., Visual, Hearing"
          placeholderTextColor={settings.highContrast ? "#fff" : "#aaa"}
          onSubmitEditing={handleAddTag}
          returnKeyType="done"
          accessible
          accessibilityLabel="Add Disability Tag Input"
          theme={{
            colors: {
              text: settings.highContrast ? "#fff" : "#000",
              placeholder: settings.highContrast ? "#fff" : "#aaa",
            },
          }}
        />
        {/* Display Tags as Pressable Text */}
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <Pressable
              key={index}
              onPress={() => handleRemoveTag(tag)}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Disability tag: ${tag}, double tap to remove`}
            >
              <Text
                style={[
                  styles.tag,
                  {
                    backgroundColor: settings.highContrast ? "#fff" : "#e0e0e0",
                    color: settings.highContrast ? "#000" : "#333",
                    fontSize: settings.fontSize - 2,
                  },
                ]}
              >
                {tag}
              </Text>
            </Pressable>
          ))}
        </View>
        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          style={[
            styles.saveButton,
            {
              backgroundColor: settings.highContrast ? "#fff" : "#6200ee",
            },
          ]}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Save Profile"
        >
          <Text
            style={{
              color: settings.highContrast ? "#000" : "#fff",
              fontSize: settings.fontSize,
              textAlign: "center",
              paddingVertical: 12,
            }}
          >
            Save
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    margin: 4,
  },
  saveButton: {
    marginTop: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#6200ee",
  },
});
