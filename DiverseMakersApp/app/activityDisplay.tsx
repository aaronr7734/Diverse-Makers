import React, { useContext } from "react";
import {
  View,
  StyleSheet,
  Linking,
  Image,
  ScrollView,
  AccessibilityInfo,
} from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  Headline,
  useTheme,
} from "react-native-paper";
import Activity from "./models/Activity";
import { UserSettingsContext } from "../contexts/UserSettingsContext";

type ActivityDisplayProps = {
  activity: Activity;
};

const ActivityDisplay: React.FC<ActivityDisplayProps> = ({ activity }) => {
  const { settings } = useContext(UserSettingsContext);
  const theme = useTheme();

  const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: settings.highContrast ? "#000" : "#fff",
    },
    card: {
      margin: 16,
      elevation: 4,
      backgroundColor: settings.highContrast ? "#000" : "#fff",
    },
    coverImage: {
      height: 200,
    },
    title: {
      marginTop: 16,
      fontSize: settings.fontSize + 10,
      fontWeight: "bold",
      color: settings.highContrast ? "#fff" : "#000",
    },
    description: {
      marginVertical: 12,
      fontSize: settings.fontSize,
      color: settings.highContrast ? "#fff" : "#555",
    },
    divider: {
      marginVertical: 12,
      backgroundColor: settings.highContrast ? "#fff" : "#ccc",
    },
    instructionsTitle: {
      fontSize: settings.fontSize + 6,
      fontWeight: "bold",
      marginBottom: 8,
      color: settings.highContrast ? "#fff" : "#000",
    },
    stepContainer: {
      marginBottom: 16,
    },
    stepTitle: {
      fontSize: settings.fontSize + 4,
      fontWeight: "bold",
      color: settings.highContrast ? "#fff" : "#333",
      marginBottom: 8,
    },
    textBlock: {
      fontSize: settings.fontSize,
      color: settings.highContrast ? "#fff" : "#444",
      marginBottom: 8,
    },
    imageBlock: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      marginBottom: 8,
    },
    mediaButton: {
      marginVertical: 8,
      backgroundColor: settings.highContrast ? "#fff" : theme.colors.primary,
    },
    mediaButtonLabel: {
      color: settings.highContrast ? "#000" : theme.colors.onPrimary,
    },
  });

  return (
    <ScrollView style={styles.scrollView}>
      <Card style={styles.card}>
        {/* Cover Image (Optional) */}
        {activity.getCoverImageUrl() && (
          <Card.Cover
            source={{ uri: activity.getCoverImageUrl() }}
            style={styles.coverImage}
            accessible
            accessibilityLabel={
              activity.getCoverImageAltText() || "Cover Image"
            }
          />
        )}
        <Card.Content>
          {/* Activity Title */}
          <Headline style={styles.title} accessibilityRole="header">
            {activity.getTitle()}
          </Headline>
          {/* Activity Description */}
          <Paragraph style={styles.description}>
            {activity.getDescription()}
          </Paragraph>
          <Divider style={styles.divider} />
          {/* Instructions */}
          <Title style={styles.instructionsTitle} accessibilityRole="header">
            Instructions
          </Title>
          {activity.getInstructions().map((step) => (
            <View key={step.id} style={styles.stepContainer}>
              {/* Step Number */}
              <Title style={styles.stepTitle} accessibilityRole="header">
                Step {step.stepNumber}
              </Title>
              {/* Content Blocks */}
              {step.contentBlocks.map((block) => {
                switch (block.type) {
                  case "text":
                    return (
                      <Paragraph key={block.id} style={styles.textBlock}>
                        {block.content}
                      </Paragraph>
                    );
                  case "image":
                    return (
                      <Image
                        key={block.id}
                        source={{ uri: block.url }}
                        style={styles.imageBlock}
                        accessible
                        accessibilityLabel={block.altText || "Image"}
                      />
                    );
                  case "video":
                  case "audio":
                  case "link":
                    return (
                      <Button
                        key={block.id}
                        mode="contained"
                        onPress={() => {
                          Linking.openURL(block.url);
                          AccessibilityInfo.announceForAccessibility(
                            `Opening ${block.type}`
                          );
                        }}
                        style={styles.mediaButton}
                        labelStyle={styles.mediaButtonLabel}
                        accessible
                        accessibilityLabel={
                          block.description || `Open ${block.type}`
                        }
                        accessibilityHint={`Opens ${block.type} in browser`}
                      >
                        {block.description || `Open ${block.type}`}
                      </Button>
                    );
                  default:
                    return null;
                }
              })}
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default ActivityDisplay;
