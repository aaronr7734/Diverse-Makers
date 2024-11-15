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
  Chip,
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
    const trimmedTag = currentTag.trim().toLowerCase();
    if (!trimmedTag) {
      Alert.alert("Validation Error", "Tag cannot be empty.");
      return;
    }
    if (tags.includes(trimmedTag)) {
      Alert.alert("Validation Error", "This tag already exists.");
      return;
    }
    setTags([...tags, trimmedTag]);
    setCurrentTag("");
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

    router.push({
      pathname: "/home/activityBuilder",
      params: {
        title: title.trim(),
        description: description.trim(),
        tags: JSON.stringify(tags),
      },
    });
  };

  const styles = StyleSheet.create({
    keyboardContainer: {
      flex: 1,
    },
    container: {
      flexGrow: 1,
      padding: 16,
    },
    title: {
      textAlign: "center",
      marginBottom: 24,
    },
    input: {
      marginBottom: 16,
    },
    tagsSection: {
      marginBottom: 16,
    },
    tagInput: {
      marginBottom: 8,
    },
    tagHeader: {
      fontSize: settings.fontSize,
      color: settings.highContrast ? "#fff" : "#000",
      marginBottom: 8,
      fontWeight: "bold",
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 8,
      marginBottom: 8,
    },
    chip: {
      margin: 4,
    },
    addTagButton: {
      alignSelf: "flex-start",
      marginBottom: 16,
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
    noTagsText: {
      color: settings.highContrast ? "#fff" : "#666",
      fontStyle: "italic",
      marginBottom: 8,
    },
  });

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

        <TextInput
          label="Activity Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
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

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
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

        <View style={styles.tagsSection}>
          <Text style={styles.tagHeader} accessibilityRole="header">
            Activity Tags
          </Text>

          <TextInput
            label="Add Tag"
            value={currentTag}
            onChangeText={setCurrentTag}
            style={styles.tagInput}
            placeholder="e.g., science, math, electronics"
            placeholderTextColor={settings.highContrast ? "#fff" : "#aaa"}
            returnKeyType="done"
            onSubmitEditing={handleAddTag}
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

          <Button
            mode="outlined"
            onPress={handleAddTag}
            style={styles.addTagButton}
            disabled={!currentTag.trim()}
            accessibilityLabel="Add Tag Button"
            accessibilityHint="Adds the current tag to the activity"
          >
            Add Tag
          </Button>

          {tags.length === 0 ? (
            <Text style={styles.noTagsText}>
              No tags added yet. Tags help make your activity discoverable!
            </Text>
          ) : (
            <View style={styles.tagsContainer}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  onClose={() => handleRemoveTag(tag)}
                  style={styles.chip}
                  textStyle={{ fontSize: settings.fontSize - 2 }}
                  accessibilityLabel={`${tag} tag, double tap to remove`}
                >
                  {tag}
                </Chip>
              ))}
            </View>
          )}
        </View>

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

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.nextButton}
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
