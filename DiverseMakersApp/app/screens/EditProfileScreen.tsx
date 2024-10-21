import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Text, Chip } from "react-native-paper";
import { UserSettingsContext } from "../contexts/UserSettingsContext";
import User from "../models/User";
import { FIREBASE_DB } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootNavigator";

type EditProfileScreenRouteProp = RouteProp<RootStackParamList, "EditProfile">;
type EditProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EditProfile"
>;

interface EditProfileScreenProps {
  route: EditProfileScreenRouteProp;
  navigation: EditProfileScreenNavigationProp;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  route,
  navigation,
}) => {
  const { settings } = useContext(UserSettingsContext);
  const { user } = route.params;

  const [username, setUsername] = useState(user.username || "");
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>(user.disabilityTags || []);

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
      // Prepare updated fields
      const updatedFields: Record<string, any> = {
        username: username.trim(),
        disabilityTags: tags,
      };

      // Update Firestore
      const userDocRef = doc(FIREBASE_DB, "users", user.userId);
      await updateDoc(userDocRef, updatedFields);

      // Update local User instance
      user.username = username.trim();
      user.disabilityTags = tags.length > 0 ? tags : undefined;

      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
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
      <ScrollView contentContainerStyle={styles.container}>
        <Text
          style={[
            styles.title,
            { fontSize: settings.fontSize + 4, color: "#6200ee" },
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
          style={[styles.input, { fontSize: settings.fontSize }]}
          placeholder="Enter your username"
          accessible
          accessibilityLabel="Username Input"
        />
        {/* Disability Tags Input */}
        <TextInput
          label="Add Disability Tag"
          value={currentTag}
          onChangeText={setCurrentTag}
          style={[styles.input, { fontSize: settings.fontSize }]}
          placeholder="e.g., Visual, Hearing"
          onSubmitEditing={handleAddTag}
          returnKeyType="done"
          accessible
          accessibilityLabel="Add Disability Tag Input"
        />
        {/* Display Tags as Chips */}
        <View style={styles.chipsContainer}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              onClose={() => handleRemoveTag(tag)}
              style={[
                styles.chip,
                {
                  backgroundColor: settings.highContrast ? "#fff" : "#e0e0e0",
                },
              ]}
              textStyle={{
                color: settings.highContrast ? "#000" : "#333",
                fontSize: settings.fontSize - 2,
              }}
              accessibilityLabel={`Disability tag: ${tag}`}
            >
              {tag}
            </Chip>
          ))}
        </View>
        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          contentStyle={{ height: 48 }}
          labelStyle={{
            color: "#fff",
            fontSize: settings.fontSize,
          }}
          accessible
          accessibilityLabel="Save Profile"
        >
          Save
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 24,
    borderRadius: 4,
  },
});

export default EditProfileScreen;
