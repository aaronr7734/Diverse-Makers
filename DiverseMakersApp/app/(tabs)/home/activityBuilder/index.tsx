import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Button, useTheme, Chip } from "react-native-paper";
import { UserSettingsContext } from "../../../../contexts/UserSettingsContext";
import { AuthContext } from "../../../../contexts/AuthContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import Activity, { InstructionStep } from "../../../models/Activity";
import { ActivityService } from "../../../services/ActivityService";
import ContentBlockModal from "./ContentBlockModal";
import StepList from "./StepList";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

const ActivityBuilderScreen: React.FC = () => {
  const { settings } = useContext(UserSettingsContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();

  // Core activity state
  const [title, setTitle] = useState<string>(() => {
    if (Array.isArray(params.title)) return params.title[0];
    return typeof params.title === "string" ? params.title : "";
  });

  const [description, setDescription] = useState<string>(() => {
    if (Array.isArray(params.description)) return params.description[0];
    return typeof params.description === "string" ? params.description : "";
  });

  const [tags, setTags] = useState<string[]>(() => {
    try {
      if (Array.isArray(params.tags)) return JSON.parse(params.tags[0]);
      return typeof params.tags === "string" ? JSON.parse(params.tags) : [];
    } catch {
      return [];
    }
  });

  // Steps management
  const [steps, setSteps] = useState<InstructionStep[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentStepNumber, setCurrentStepNumber] = useState<number>(1);
  const [currentTag, setCurrentTag] = useState<string>("");

  useEffect(() => {
    if (!user) {
      Alert.alert("Error", "User not found.");
      router.back();
    }
  }, [user]);

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

  const handleAddStep = () => {
    setCurrentStepNumber(steps.length + 1);
    setIsModalVisible(true);
  };

  const handleStepSave = (contentBlocks: any[]) => {
    const newStep: InstructionStep = {
      id: uuidv4(),
      stepNumber: currentStepNumber,
      contentBlocks,
    };

    setSteps([...steps, newStep]);
    setIsModalVisible(false);
  };

  const handleStepDelete = (stepId: string) => {
    Alert.alert("Confirm", "Are you sure you want to delete this step?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updatedSteps = steps.filter((step) => step.id !== stepId);
          const reNumberedSteps = updatedSteps.map((step, index) => ({
            ...step,
            stepNumber: index + 1,
          }));
          setSteps(reNumberedSteps);
        },
      },
    ]);
  };

  const handleStepReorder = (fromIndex: number, toIndex: number) => {
    const reorderedSteps = [...steps];
    const [movedStep] = reorderedSteps.splice(fromIndex, 1);
    reorderedSteps.splice(toIndex, 0, movedStep);

    const reNumberedSteps = reorderedSteps.map((step, index) => ({
      ...step,
      stepNumber: index + 1,
    }));
    setSteps(reNumberedSteps);
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: settings.highContrast ? "#000" : "#fff",
      padding: 16,
    },
    title: {
      fontSize: settings.fontSize + 4,
      color: settings.highContrast ? "#fff" : theme.colors.primary,
      textAlign: "center",
      marginBottom: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: settings.fontSize + 2,
      color: settings.highContrast ? "#fff" : "#000",
      marginBottom: 12,
      fontWeight: "bold",
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 8,
    },
    chip: {
      margin: 4,
    },
    tagInput: {
      marginBottom: 8,
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
    noTagsText: {
      color: settings.highContrast ? "#fff" : "#666",
      fontStyle: "italic",
      marginBottom: 8,
    },
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <Text style={styles.title} accessibilityRole="header">
        Build Your Activity
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Activity Details
        </Text>
        <Text style={{ color: settings.highContrast ? "#fff" : "#000" }}>
          Title: {title}
        </Text>
        <Text style={{ color: settings.highContrast ? "#fff" : "#000" }}>
          Description: {description}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Tags
        </Text>
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
                accessibilityRole="button"
                accessibilityLabel={`${tag} tag`}
                accessibilityHint="Double tap to remove tag"
              >
                {tag}
              </Chip>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Instructions
        </Text>
        <StepList
          steps={steps}
          onDelete={handleStepDelete}
          onReorder={handleStepReorder}
          fontSize={settings.fontSize}
          highContrast={settings.highContrast}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleAddStep}
        style={styles.addButton}
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
        style={styles.saveButton}
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

      <ContentBlockModal
        visible={isModalVisible}
        stepNumber={currentStepNumber}
        onDismiss={() => setIsModalVisible(false)}
        onSave={handleStepSave}
        userId={user?.userId || ""}
        fontSize={settings.fontSize}
        highContrast={settings.highContrast}
      />
    </ScrollView>
  );
};

export default ActivityBuilderScreen;
