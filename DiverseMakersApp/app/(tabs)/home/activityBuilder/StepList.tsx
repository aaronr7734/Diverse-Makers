import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Text, IconButton, Card, useTheme } from "react-native-paper";
import { InstructionStep } from "../../../models/Activity";

interface StepListProps {
  steps: InstructionStep[];
  onDelete: (stepId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  fontSize: number;
  highContrast: boolean;
}

const StepList: React.FC<StepListProps> = ({
  steps,
  onDelete,
  onReorder,
  fontSize,
  highContrast,
}) => {
  const theme = useTheme();
  const [animations, setAnimations] = useState<Animated.ValueXY[]>([]);
  const itemRefs = useRef<View[]>([]);

  useEffect(() => {
    // Initialize animations whenever steps change
    setAnimations(steps.map(() => new Animated.ValueXY()));
  }, [steps.length]);

  const getContentPreview = (block: any) => {
    switch (block.type) {
      case "text":
        return block.content.substring(0, 50) + (block.content.length > 50 ? "..." : "");
      case "image":
        return `Image: ${block.altText}`;
      case "video":
        return `Video: ${block.description}`;
      default:
        return "Unknown content type";
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    stepCard: {
      marginBottom: 12,
      backgroundColor: highContrast ? "#333" : "#fff",
      borderRadius: 8,
    },
    stepHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: highContrast ? "#666" : "#eee",
    },
    stepTitle: {
      fontSize: fontSize + 2,
      fontWeight: "bold",
      color: highContrast ? "#fff" : "#000",
    },
    contentPreview: {
      padding: 16,
    },
    blockPreview: {
      marginBottom: 8,
      padding: 8,
      backgroundColor: highContrast ? "#444" : "#f5f5f5",
      borderRadius: 4,
    },
    blockType: {
      fontSize: fontSize - 1,
      fontWeight: "bold",
      color: highContrast ? "#fff" : "#000",
      marginBottom: 4,
    },
    blockContent: {
      fontSize: fontSize - 1,
      color: highContrast ? "#ccc" : "#666",
    },
    emptyText: {
      textAlign: "center",
      color: highContrast ? "#fff" : "#666",
      fontSize: fontSize,
      fontStyle: "italic",
      padding: 16,
    },
    stepNumber: {
      flexDirection: "row",
      alignItems: "center",
    },
    deleteButton: {
      margin: 0,
    },
  });

  if (steps.length === 0) {
    return (
      <Text style={styles.emptyText}>
        No steps added yet. Start building your activity by adding steps!
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <Card 
          key={step.id}
          style={styles.stepCard}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Step ${step.stepNumber}`}
          accessibilityHint={`Contains ${step.contentBlocks.length} content blocks`}
        >
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepTitle}>
                Step {step.stepNumber}
              </Text>
            </View>
            <IconButton
              icon="delete"
              size={20}
              iconColor={highContrast ? "#fff" : theme.colors.error}
              onPress={() => onDelete(step.id)}
              accessibilityLabel={`Delete step ${step.stepNumber}`}
              style={styles.deleteButton}
            />
          </View>
          <View style={styles.contentPreview}>
            {step.contentBlocks.map((block) => (
              <View 
                key={block.id} 
                style={styles.blockPreview}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={`${block.type} content: ${getContentPreview(block)}`}
              >
                <Text style={styles.blockType}>
                  {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                </Text>
                <Text style={styles.blockContent}>
                  {getContentPreview(block)}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      ))}
    </View>
  );
};

export default StepList;