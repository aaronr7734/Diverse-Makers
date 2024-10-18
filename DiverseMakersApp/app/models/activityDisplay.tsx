import React from "react";
import { View, StyleSheet, Linking } from "react-native";
import { Card, Title, Paragraph, Button } from "react-native-paper";
import Activity from "./Activity"; // Adjust the import path accordingly

type ActivityDisplayProps = {
  activity: Activity; // Prop type for the Activity object
};

const ActivityDisplay: React.FC<ActivityDisplayProps> = ({ activity }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{activity.title}</Title>
        <Paragraph style={styles.description}>{activity.description}</Paragraph>

        {/* Display Media Items */}
        <View style={styles.mediaContainer}>
          {activity.mediaUrls.map((mediaItem, index) => {
            if (mediaItem.type === "image") {
              return (
                <Card.Cover
                  key={index}
                  source={{ uri: mediaItem.url }}
                  style={styles.image}
                />
              );
            } else if (mediaItem.type === "video" || mediaItem.type === "link") {
              return (
                <Button
                  key={index}
                  mode="outlined"
                  onPress={() => Linking.openURL(mediaItem.url)}
                  style={styles.link}
                >
                  {mediaItem.description || "Watch Video/Link"}
                </Button>
              );
            }
            return null;
          })}
        </View>

        {/* Display Instructions */}
        <Title style={styles.instructionsTitle}>Instructions:</Title>
        {Object.entries(activity.instructions).map(([disabilityType, instruction]) => (
          <View key={disabilityType} style={styles.instructionContainer}>
            <Paragraph style={styles.disabilityType}>{disabilityType}</Paragraph>
            <Paragraph style={styles.instruction}>{instruction}</Paragraph>
          </View>
        ))}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    marginBottom: 12,
  },
  mediaContainer: {
    marginBottom: 12,
  },
  image: {
    height: 200,
  },
  link: {
    marginVertical: 8,
  },
  instructionsTitle: {
    fontWeight: "bold",
    marginTop: 12,
  },
  instructionContainer: {
    marginBottom: 8,
  },
  disabilityType: {
    fontWeight: "bold",
  },
  instruction: {
    fontSize: 14,
  },
});

export default ActivityDisplay;
