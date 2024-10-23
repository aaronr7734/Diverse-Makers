import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  TextInput,
  Text,
  Checkbox,
  Button,
  useTheme,
} from "react-native-paper";
import { UserSettingsContext } from "../../../contexts/UserSettingsContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { useRouter } from "expo-router";

const NewActivityScreen: React.FC = () => {
  const { settings } = useContext(UserSettingsContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const theme = useTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isApplicableToAll, setIsApplicableToAll] = useState(true);

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

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("Validation Error", "Activity title cannot be empty.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User not found.");
      return;
    }

    // Navigate to the Activity Builder screen with the activity data
    router.push({
      pathname: "/home/activityBuilder",
      params: {
        title: title.trim(),
        description: description.trim(),
        tags: JSON.stringify(tags),
      },
    });
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
              color: settings.highContrast ? "#fff" : theme.colors.primary,
            },
          ]}
          accessibilityRole="header"
        >
          Create New Activity
        </Text>
        {/* Activity Title Input */}
        <TextInput
          label="Activity Title"
          value={title}
          onChangeText={setTitle}
          style={[
            styles.input,
            {
              backgroundColor: settings.highContrast ? "#000" : "#fff",
            },
          ]}
          placeholder="Enter the activity title"
          placeholderTextColor={settings.highContrast ? "#fff" : "#aaa"}
          accessible
          accessibilityLabel="Activity Title Input"
          theme={{
            colors: {
              text: settings.highContrast ? "#fff" : "#000",
              placeholder: settings.highContrast ? "#fff" : "#aaa",
              primary: settings.highContrast ? "#fff" : theme.colors.primary,
            },
          }}
        />
        {/* Activity Description Input */}
        <TextInput
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          style={[
            styles.input,
            {
              backgroundColor: settings.highContrast ? "#000" : "#fff",
            },
          ]}
          placeholder="Enter a brief description"
          placeholderTextColor={settings.highContrast ? "#fff" : "#aaa"}
          accessible
          accessibilityLabel="Activity Description Input"
          multiline
          numberOfLines={4}
          theme={{
            colors: {
              text: settings.highContrast ? "#fff" : "#000",
              placeholder: settings.highContrast ? "#fff" : "#aaa",
              primary: settings.highContrast ? "#fff" : theme.colors.primary,
            },
          }}
        />
        {/* Tags Input */}
        <TextInput
          label="Add Tag"
          value={currentTag}
          onChangeText={setCurrentTag}
          style={[
            styles.input,
            {
              backgroundColor: settings.highContrast ? "#000" : "#fff",
            },
          ]}
          placeholder="e.g., Science, Math"
          placeholderTextColor={settings.highContrast ? "#fff" : "#aaa"}
          onSubmitEditing={handleAddTag}
          returnKeyType="done"
          accessible
          accessibilityLabel="Add Tag Input"
          theme={{
            colors: {
              text: settings.highContrast ? "#fff" : "#000",
              placeholder: settings.highContrast ? "#fff" : "#aaa",
              primary: settings.highContrast ? "#fff" : theme.colors.primary,
            },
          }}
        />
        {/* Display Tags */}
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <Button
              key={index}
              mode="outlined"
              onPress={() => handleRemoveTag(tag)}
              style={[
                styles.tagButton,
                {
                  borderColor: settings.highContrast
                    ? "#fff"
                    : theme.colors.primary,
                },
              ]}
              labelStyle={{
                color: settings.highContrast ? "#fff" : theme.colors.primary,
                fontSize: settings.fontSize - 2,
              }}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Tag: ${tag}, double tap to remove`}
            >
              {tag}
            </Button>
          ))}
        </View>
        {/* Applicable Disabilities Checkbox */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={isApplicableToAll ? "checked" : "unchecked"}
            disabled
            color={settings.highContrast ? "#fff" : theme.colors.primary}
          />
          <Text
            style={{
              color: settings.highContrast ? "#fff" : "#000",
              fontSize: settings.fontSize,
              marginLeft: 8,
            }}
          >
            Applicable to all disabilities
          </Text>
        </View>
        {/* Next Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={[
            styles.nextButton,
            {
              backgroundColor: settings.highContrast
                ? "#fff"
                : theme.colors.primary,
            },
          ]}
          labelStyle={{
            color: settings.highContrast ? "#000" : "#fff",
            fontSize: settings.fontSize,
          }}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Next"
        >
          Next
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default NewActivityScreen;

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
  tagButton: {
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  nextButton: {
    borderRadius: 4,
    paddingVertical: 12,
  },
});
