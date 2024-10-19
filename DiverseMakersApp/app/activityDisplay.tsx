import React from "react";
import { View, StyleSheet, Linking, Image, ScrollView } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  Headline,
} from "react-native-paper";
import Activity from "./models/Activity";

type ActivityDisplayProps = {
  activity: Activity; // Prop type for the Activity object
};

const ActivityDisplay: React.FC<ActivityDisplayProps> = ({ activity }) => {
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
          <Headline style={styles.title} accessible accessibilityRole="header">
            {activity.getTitle()}
          </Headline>
          {/* Activity Description */}
          <Paragraph style={styles.description}>
            {activity.getDescription()}
          </Paragraph>
          <Divider style={styles.divider} />
          {/* Instructions */}
          <Title
            style={styles.instructionsTitle}
            accessible
            accessibilityRole="header"
          >
            Instructions
          </Title>
          {activity.getInstructions().map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              {/* Step Number */}
              <Title
                style={styles.stepTitle}
                accessible
                accessibilityRole="header"
              >
                Step {step.stepNumber}
              </Title>
              {/* Content Blocks */}
              {step.contentBlocks.map((block, idx) => {
                switch (block.type) {
                  case "text":
                    return (
                      <Paragraph key={idx} style={styles.textBlock}>
                        {block.content}
                      </Paragraph>
                    );
                  case "image":
                    return (
                      <Image
                        key={idx}
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
                        key={idx}
                        mode="contained"
                        onPress={() => Linking.openURL(block.url)}
                        style={styles.mediaButton}
                        accessible
                        accessibilityLabel={
                          block.description || `Open ${block.type}`
                        }
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

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  coverImage: {
    height: 200,
  },
  title: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    marginVertical: 12,
    fontSize: 16,
    color: "#555",
  },
  divider: {
    marginVertical: 12,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  stepContainer: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  textBlock: {
    fontSize: 16,
    color: "#444",
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
  },
});

export default ActivityDisplay;
