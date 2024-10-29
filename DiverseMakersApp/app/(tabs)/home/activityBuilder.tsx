import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, FlatList } from "react-native";
import {
  Text,
  Button,
  useTheme,
  Modal,
  TextInput,
  IconButton,
} from "react-native-paper";
import { UserSettingsContext } from "../../../contexts/UserSettingsContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import InstructionBuilder from "../../utils/InstructionBuilder";
import Activity, { InstructionStep } from "../../models/Activity";
import { ActivityService } from "../../services/ActivityService";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

const ActivityBuilderScreen: React.FC = () => {
  const { settings } = useContext(UserSettingsContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();

  const [title, setTitle] = useState<string>(() => {
    if (Array.isArray(params.title)) {
      return params.title[0];
    } else if (typeof params.title === "string") {
      return params.title;
    } else {
      return "";
    }
  });

  const [description, setDescription] = useState<string>(() => {
    if (Array.isArray(params.description)) {
      return params.description[0];
    } else if (typeof params.description === "string") {
      return params.description;
    } else {
      return "";
    }
  });

  const [tags, setTags] = useState<string[]>(() => {
    if (Array.isArray(params.tags)) {
      return JSON.parse(params.tags[0]);
    } else if (typeof params.tags === "string") {
      return JSON.parse(params.tags);
    } else {
      return [];
    }
  });

  const [steps, setSteps] = useState<InstructionStep[]>([]);
  const [currentStepNumber, setCurrentStepNumber] = useState<number>(
    steps.length + 1
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [contentBlocks, setContentBlocks] = useState<any[]>([]);
  const [contentType, setContentType] = useState<string>("");

  const [textContent, setTextContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageAltText, setImageAltText] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoDescription, setVideoDescription] = useState<string>("");

  useEffect(() => {
    if (!user) {
      Alert.alert("Error", "User not found.");
      router.back();
    }
  }, [user]);

  const handleAddStep = () => {
    setCurrentStepNumber(steps.length + 1);
    setContentBlocks([]);
    setContentType("");
    resetContentInputs();
    setIsModalVisible(true);
  };

  const handleSaveStep = () => {
    if (contentBlocks.length === 0) {
      Alert.alert("Validation Error", "Please add at least one content block.");
      return;
    }

    const newStep: InstructionStep = {
      id: uuidv4(),
      stepNumber: currentStepNumber,
      contentBlocks: contentBlocks,
    };

    setSteps([...steps, newStep]);
    setIsModalVisible(false);
    resetContentInputs();
  };

  const resetContentInputs = () => {
    setTextContent("");
    setImageUrl("");
    setImageAltText("");
    setVideoUrl("");
    setVideoDescription("");
    setContentBlocks([]);
    setContentType("");
  };

  const handleAddContentBlock = () => {
    if (!user) {
      Alert.alert("Error", "User not found.");
      return;
    }

    const builder = new InstructionBuilder(user.userId, ["all"]);
    let blockId: string | undefined;

    try {
      if (contentType === "text") {
        if (!textContent.trim()) {
          Alert.alert("Validation Error", "Text content cannot be empty.");
          return;
        }
        blockId = builder.addText(textContent.trim());
      } else if (contentType === "image") {
        if (!imageUrl.trim()) {
          Alert.alert("Validation Error", "Image URL cannot be empty.");
          return;
        }
        if (!imageAltText.trim()) {
          Alert.alert("Validation Error", "Alt text cannot be empty.");
          return;
        }
        blockId = builder.addImage(imageUrl.trim(), imageAltText.trim());
      } else if (contentType === "video") {
        if (!videoUrl.trim()) {
          Alert.alert("Validation Error", "Video URL cannot be empty.");
          return;
        }
        if (!videoDescription.trim()) {
          Alert.alert("Validation Error", "Video description cannot be empty.");
          return;
        }
        blockId = builder.addMedia(
          "video",
          videoUrl.trim(),
          videoDescription.trim()
        );
      } else {
        Alert.alert("Error", "Unsupported content type.");
        return;
      }

      const newContentBlock = builder.getContentBlock(blockId);
      setContentBlocks([...contentBlocks, newContentBlock]);

      // Reset inputs
      setTextContent("");
      setImageUrl("");
      setImageAltText("");
      setVideoUrl("");
      setVideoDescription("");
      setContentType("");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleRemoveStep = (stepId: string) => {
    Alert.alert("Confirm", "Are you sure you want to delete this step?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updatedSteps = steps.filter((step) => step.id !== stepId);
          // Re-number the steps
          const reNumberedSteps = updatedSteps.map((step, index) => ({
            ...step,
            stepNumber: index + 1,
          }));
          setSteps(reNumberedSteps);
        },
      },
    ]);
  };

  const handleSaveActivity = async () => {
    if (steps.length === 0) {
      Alert.alert("Validation Error", "Please add at least one step.");
      return;
    }

    try {
      const newActivity = new Activity({
        title,
        description,
        tags,
        instructions: steps,
        createdBy: user!.userId,
      });

      await ActivityService.addActivity(newActivity);

      Alert.alert("Success", "Activity created successfully!");
      router.replace("/home");
    } catch (error) {
      console.error("Error creating activity:", error);
      Alert.alert("Error", "Failed to create activity. Please try again.");
    }
  };

  const renderStepItem = ({ item }: { item: InstructionStep }) => (
    <View style={styles.stepItem}>
      <Text
        style={[
          styles.stepTitle,
          {
            fontSize: settings.fontSize + 2,
            color: settings.highContrast ? "#fff" : "#000",
          },
        ]}
        accessible
        accessibilityRole="text"
      >
        Step {item.stepNumber}
      </Text>

      <IconButton
        icon="delete"
        size={24}
        iconColor={settings.highContrast ? "#fff" : theme.colors.error}
        onPress={() => handleRemoveStep(item.id)}
        accessibilityLabel={`Delete Step ${item.stepNumber}`}
        accessibilityHint="Removes this step from the activity"
      />
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: settings.highContrast ? "#000" : "#fff" },
      ]}
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
        Build Your Activity
      </Text>

      <FlatList
        data={steps}
        keyExtractor={(item) => item.id}
        renderItem={renderStepItem}
        ListEmptyComponent={
          <Text
            style={{
              color: settings.highContrast ? "#fff" : "#555",
              fontSize: settings.fontSize,
              textAlign: "center",
              marginVertical: 20,
            }}
            accessible
            accessibilityRole="text"
          >
            No steps added yet.
          </Text>
        }
        accessible
        accessibilityLabel="List of steps"
      />

      <Button
        mode="contained"
        onPress={handleAddStep}
        style={[
          styles.addButton,
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
        accessibilityLabel="Add Step"
      >
        Add Step
      </Button>

      <Button
        mode="contained"
        onPress={handleSaveActivity}
        style={[
          styles.saveButton,
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
        accessibilityLabel="Save Activity"
      >
        Save Activity
      </Button>

      {/* Modal for adding content blocks */}
      <Modal
        visible={isModalVisible}
        onDismiss={() => setIsModalVisible(false)}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: settings.highContrast ? "#000" : "#fff" },
        ]}
      >
        <View accessible accessibilityViewIsModal>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text
              style={[
                styles.modalTitle,
                {
                  fontSize: settings.fontSize + 2,
                  color: settings.highContrast ? "#fff" : theme.colors.primary,
                },
              ]}
              accessibilityRole="header"
            >
              Add Content to Step {currentStepNumber}
            </Text>

            {/* Content Type Selection */}
            <Text
              style={{
                color: settings.highContrast ? "#fff" : "#000",
                fontSize: settings.fontSize,
                marginBottom: 8,
              }}
              accessible
              accessibilityRole="text"
            >
              Select Content Type:
            </Text>

            <View style={styles.contentTypeContainer}>
              <Button
                mode={contentType === "text" ? "contained" : "outlined"}
                onPress={() => setContentType("text")}
                style={styles.contentTypeButton}
                labelStyle={{
                  color:
                    contentType === "text"
                      ? settings.highContrast
                        ? "#000"
                        : "#fff"
                      : settings.highContrast
                      ? "#fff"
                      : theme.colors.primary,
                  fontSize: settings.fontSize,
                }}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Text Content Type"
              >
                Text
              </Button>
              <Button
                mode={contentType === "image" ? "contained" : "outlined"}
                onPress={() => setContentType("image")}
                style={styles.contentTypeButton}
                labelStyle={{
                  color:
                    contentType === "image"
                      ? settings.highContrast
                        ? "#000"
                        : "#fff"
                      : settings.highContrast
                      ? "#fff"
                      : theme.colors.primary,
                  fontSize: settings.fontSize,
                }}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Image Content Type"
              >
                Image
              </Button>
              <Button
                mode={contentType === "video" ? "contained" : "outlined"}
                onPress={() => setContentType("video")}
                style={styles.contentTypeButton}
                labelStyle={{
                  color:
                    contentType === "video"
                      ? settings.highContrast
                        ? "#000"
                        : "#fff"
                      : settings.highContrast
                      ? "#fff"
                      : theme.colors.primary,
                  fontSize: settings.fontSize,
                }}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Video Content Type"
              >
                Video
              </Button>
            </View>

            {/* Content Inputs */}
            {contentType === "text" && (
              <TextInput
                label="Text Content"
                value={textContent}
                onChangeText={setTextContent}
                style={[
                  styles.input,
                  {
                    backgroundColor: settings.highContrast ? "#000" : "#fff",
                  },
                ]}
                placeholder="Enter text content"
                placeholderTextColor={settings.highContrast ? "#fff" : "#aaa"}
                multiline
                numberOfLines={4}
                theme={{
                  colors: {
                    text: settings.highContrast ? "#fff" : "#000",
                    placeholder: settings.highContrast ? "#fff" : "#aaa",
                    primary: settings.highContrast
                      ? "#fff"
                      : theme.colors.primary,
                  },
                }}
                accessible
                accessibilityLabel="Text Content Input"
              />
            )}

            {contentType === "image" && (
              <>
                <TextInput
                  label="Image URL"
                  value={imageUrl}
                  onChangeText={setImageUrl}
                  style={[
                    styles.input,
                    {
                      backgroundColor: settings.highContrast ? "#000" : "#fff",
                    },
                  ]}
                  placeholder="Enter image URL"
                  placeholderTextColor={settings.highContrast ? "#fff" : "#aaa"}
                  theme={{
                    colors: {
                      text: settings.highContrast ? "#fff" : "#000",
                      placeholder: settings.highContrast ? "#fff" : "#aaa",
                      primary: settings.highContrast
                        ? "#fff"
                        : theme.colors.primary,
                    },
                  }}
                  accessible
                  accessibilityLabel="Image URL Input"
                  keyboardType="url"
                  autoCapitalize="none"
                />
                <TextInput
                  label="Alt Text"
                  value={imageAltText}
                  onChangeText={setImageAltText}
                  style={[
                    styles.input,
                    {
                      backgroundColor: settings.highContrast ? "#000" : "#fff",
                    },
                  ]}
                  placeholder="Enter alt text for the image"
                  placeholderTextColor={settings.highContrast ? "#fff" : "#aaa"}
                  theme={{
                    colors: {
                      text: settings.highContrast ? "#fff" : "#000",
                      placeholder: settings.highContrast ? "#fff" : "#aaa",
                      primary: settings.highContrast
                        ? "#fff"
                        : theme.colors.primary,
                    },
                  }}
                  accessible
                  accessibilityLabel="Image Alt Text Input"
                />
              </>
            )}

            {contentType === "video" && (
              <>
                <TextInput
                  label="Video URL"
                  value={videoUrl}
                  onChangeText={setVideoUrl}
                  style={[
                    styles.input,
                    {
                      backgroundColor: settings.highContrast ? "#000" : "#fff",
                    },
                  ]}
                  placeholder="Enter video URL"
                  placeholderTextColor={settings.highContrast ? "#fff" : "#aaa"}
                  theme={{
                    colors: {
                      text: settings.highContrast ? "#fff" : "#000",
                      placeholder: settings.highContrast ? "#fff" : "#aaa",
                      primary: settings.highContrast
                        ? "#fff"
                        : theme.colors.primary,
                    },
                  }}
                  accessible
                  accessibilityLabel="Video URL Input"
                  keyboardType="url"
                  autoCapitalize="none"
                />
                <TextInput
                  label="Video Description"
                  value={videoDescription}
                  onChangeText={setVideoDescription}
                  style={[
                    styles.input,
                    {
                      backgroundColor: settings.highContrast ? "#000" : "#fff",
                    },
                  ]}
                  placeholder="Enter video description"
                  placeholderTextColor={settings.highContrast ? "#fff" : "#aaa"}
                  multiline
                  numberOfLines={3}
                  theme={{
                    colors: {
                      text: settings.highContrast ? "#fff" : "#000",
                      placeholder: settings.highContrast ? "#fff" : "#aaa",
                      primary: settings.highContrast
                        ? "#fff"
                        : theme.colors.primary,
                    },
                  }}
                  accessible
                  accessibilityLabel="Video Description Input"
                />
              </>
            )}

            <Button
              mode="contained"
              onPress={handleAddContentBlock}
              style={[
                styles.addContentButton,
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
              disabled={!contentType}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Add Content Block"
            >
              Add Content Block
            </Button>

            {/* Display Added Content Blocks */}
            <FlatList
              data={contentBlocks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.contentBlockItem}>
                  <Text
                    style={{
                      color: settings.highContrast ? "#fff" : "#000",
                      fontSize: settings.fontSize,
                    }}
                    accessible
                    accessibilityRole="text"
                  >
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}{" "}
                    Block
                  </Text>
                </View>
              )}
              ListHeaderComponent={
                contentBlocks.length > 0 ? (
                  <Text
                    style={{
                      color: settings.highContrast ? "#fff" : "#000",
                      fontSize: settings.fontSize,
                      marginTop: 16,
                      marginBottom: 8,
                    }}
                    accessible
                    accessibilityRole="header"
                  >
                    Content Blocks Added:
                  </Text>
                ) : null
              }
            />

            {/* Save Step Button */}
            <Button
              mode="contained"
              onPress={handleSaveStep}
              style={[
                styles.saveStepButton,
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
              accessibilityLabel="Save Step"
            >
              Save Step
            </Button>

            {/* Cancel Button */}
            <Button
              mode="text"
              onPress={() => {
                setIsModalVisible(false);
                resetContentInputs();
              }}
              labelStyle={{
                color: settings.highContrast ? "#fff" : theme.colors.primary,
                fontSize: settings.fontSize,
              }}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              Cancel
            </Button>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default ActivityBuilderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  addButton: {
    marginTop: 16,
    borderRadius: 4,
    paddingVertical: 12,
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 4,
    paddingVertical: 12,
  },
  modalContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 16,
  },
  contentTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  contentTypeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  input: {
    marginBottom: 16,
  },
  addContentButton: {
    borderRadius: 4,
    paddingVertical: 12,
    marginTop: 8,
  },
  saveStepButton: {
    marginTop: 16,
    borderRadius: 4,
    paddingVertical: 12,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  stepTitle: {
    fontWeight: "bold",
  },
  contentBlockItem: {
    paddingVertical: 4,
  },
});
