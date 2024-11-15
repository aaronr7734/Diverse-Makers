import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Modal, Text, Button, TextInput, useTheme } from "react-native-paper";
import InstructionBuilder from "../../../utils/InstructionBuilder";

interface ContentBlockModalProps {
  visible: boolean;
  stepNumber: number;
  onDismiss: () => void;
  onSave: (contentBlocks: any[]) => void;
  userId: string;
  fontSize: number;
  highContrast: boolean;
}

interface ContentBlock {
  id: string;
  type: string;
  content?: string;
  url?: string;
  altText?: string;
  description?: string;
}

const ContentBlockModal: React.FC<ContentBlockModalProps> = ({
  visible,
  stepNumber,
  onDismiss,
  onSave,
  userId,
  fontSize,
  highContrast,
}) => {
  const theme = useTheme();

  // Content type and blocks state
  const [contentType, setContentType] = useState<string>("");
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);

  // Input states
  const [textContent, setTextContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAltText, setImageAltText] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDescription, setVideoDescription] = useState("");

  const resetInputs = () => {
    setTextContent("");
    setImageUrl("");
    setImageAltText("");
    setVideoUrl("");
    setVideoDescription("");
    setContentType("");
  };

  const handleClose = () => {
    resetInputs();
    setContentBlocks([]);
    onDismiss();
  };

  const handleAddContentBlock = () => {
    const builder = new InstructionBuilder(userId, ["all"]);
    let blockId: string | undefined;

    try {
      if (contentType === "text") {
        if (!textContent.trim())
          throw new Error("Text content cannot be empty.");
        blockId = builder.addText(textContent.trim());
      } else if (contentType === "image") {
        if (!imageUrl.trim()) throw new Error("Image URL cannot be empty.");
        if (!imageAltText.trim()) throw new Error("Alt text cannot be empty.");
        blockId = builder.addImage(imageUrl.trim(), imageAltText.trim());
      } else if (contentType === "video") {
        if (!videoUrl.trim()) throw new Error("Video URL cannot be empty.");
        if (!videoDescription.trim())
          throw new Error("Video description cannot be empty.");
        blockId = builder.addMedia(
          "video",
          videoUrl.trim(),
          videoDescription.trim()
        );
      } else {
        throw new Error("Invalid content type.");
      }

      const newBlock = builder.getContentBlock(blockId);
      setContentBlocks([...contentBlocks, newBlock]);
      resetInputs();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleRemoveBlock = (index: number) => {
    const updatedBlocks = contentBlocks.filter((_, i) => i !== index);
    setContentBlocks(updatedBlocks);
  };

  const handleSave = () => {
    if (contentBlocks.length === 0) {
      alert("Please add at least one content block.");
      return;
    }
    onSave(contentBlocks);
    setContentBlocks([]);
    resetInputs();
  };

  const styles = StyleSheet.create({
    modalContainer: {
      backgroundColor: highContrast ? "#000" : "#fff",
      margin: 16,
      padding: 16,
      borderRadius: 8,
      maxHeight: "90%",
    },
    title: {
      fontSize: fontSize + 2,
      color: highContrast ? "#fff" : theme.colors.primary,
      textAlign: "center",
      marginBottom: 16,
      fontWeight: "bold",
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: fontSize,
      color: highContrast ? "#fff" : "#000",
      marginBottom: 8,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 16,
    },
    typeButton: {
      flex: 1,
      marginHorizontal: 4,
    },
    input: {
      marginBottom: 12,
      backgroundColor: highContrast ? "#333" : "#fff",
    },
    previewContainer: {
      padding: 8,
      borderRadius: 4,
      backgroundColor: highContrast ? "#333" : "#f5f5f5",
      marginBottom: 8,
    },
    previewText: {
      fontSize: fontSize - 1,
      color: highContrast ? "#fff" : "#000",
    },
    previewTitle: {
      fontSize: fontSize - 1,
      color: highContrast ? "#fff" : "#000",
      fontWeight: "bold",
      marginBottom: 4,
    },
    actionButton: {
      marginTop: 8,
    },
    removeButton: {
      marginTop: 4,
    },
  });

  return (
    <Modal
      visible={visible}
      onDismiss={handleClose}
      contentContainerStyle={styles.modalContainer}
    >
      <ScrollView>
        <Text style={styles.title} accessibilityRole="header">
          Add Content to Step {stepNumber}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Content Type:</Text>
          <View style={styles.buttonContainer}>
            {["text", "image", "video"].map((type) => (
              <Button
                key={type}
                mode={contentType === type ? "contained" : "outlined"}
                onPress={() => setContentType(type)}
                style={styles.typeButton}
                labelStyle={{ fontSize: fontSize - 2 }}
                accessibilityLabel={`${type} content type`}
                accessibilityState={{ selected: contentType === type }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </View>
        </View>

        {contentType === "text" && (
          <View style={styles.section}>
            <TextInput
              label="Text Content"
              value={textContent}
              onChangeText={setTextContent}
              multiline
              numberOfLines={4}
              style={styles.input}
              theme={{
                colors: {
                  text: highContrast ? "#fff" : "#000",
                  placeholder: highContrast ? "#ccc" : "#666",
                },
              }}
              accessibilityLabel="Text content input"
            />
          </View>
        )}

        {contentType === "image" && (
          <View style={styles.section}>
            <TextInput
              label="Image URL"
              value={imageUrl}
              onChangeText={setImageUrl}
              style={styles.input}
              theme={{
                colors: {
                  text: highContrast ? "#fff" : "#000",
                  placeholder: highContrast ? "#ccc" : "#666",
                },
              }}
              accessibilityLabel="Image URL input"
            />
            <TextInput
              label="Alt Text"
              value={imageAltText}
              onChangeText={setImageAltText}
              style={styles.input}
              theme={{
                colors: {
                  text: highContrast ? "#fff" : "#000",
                  placeholder: highContrast ? "#ccc" : "#666",
                },
              }}
              accessibilityLabel="Image alt text input"
            />
          </View>
        )}

        {contentType === "video" && (
          <View style={styles.section}>
            <TextInput
              label="Video URL"
              value={videoUrl}
              onChangeText={setVideoUrl}
              style={styles.input}
              theme={{
                colors: {
                  text: highContrast ? "#fff" : "#000",
                  placeholder: highContrast ? "#ccc" : "#666",
                },
              }}
              accessibilityLabel="Video URL input"
            />
            <TextInput
              label="Video Description"
              value={videoDescription}
              onChangeText={setVideoDescription}
              style={styles.input}
              multiline
              numberOfLines={3}
              theme={{
                colors: {
                  text: highContrast ? "#fff" : "#000",
                  placeholder: highContrast ? "#ccc" : "#666",
                },
              }}
              accessibilityLabel="Video description input"
            />
          </View>
        )}

        {contentType && (
          <Button
            mode="contained"
            onPress={handleAddContentBlock}
            style={styles.actionButton}
            accessibilityLabel="Add content block"
          >
            Add Content Block
          </Button>
        )}

        {contentBlocks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Added Content Blocks:</Text>
            {contentBlocks.map((block, index) => (
              <View key={block.id} style={styles.previewContainer}>
                <Text style={styles.previewTitle}>
                  {block.type.charAt(0).toUpperCase() + block.type.slice(1)}{" "}
                  Block
                </Text>
                <Text style={styles.previewText}>
                  {block.type === "text"
                    ? block.content
                    : block.type === "image"
                    ? `Image: ${block.altText}`
                    : `Video: ${block.description}`}
                </Text>
                <Button
                  mode="text"
                  onPress={() => handleRemoveBlock(index)}
                  style={styles.removeButton}
                  textColor={theme.colors.error}
                  accessibilityLabel={`Remove ${block.type} block`}
                >
                  Remove
                </Button>
              </View>
            ))}
          </View>
        )}

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.actionButton}
          accessibilityLabel="Save step"
        >
          Save Step
        </Button>

        <Button
          mode="outlined"
          onPress={handleClose}
          style={styles.actionButton}
          accessibilityLabel="Cancel"
        >
          Cancel
        </Button>
      </ScrollView>
    </Modal>
  );
};

export default ContentBlockModal;
