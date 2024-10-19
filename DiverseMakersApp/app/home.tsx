import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import Activity from "./models/Activity"; // Import your Activity class
import ActivityDisplay from "./activityDisplay"; // Import your ActivityDisplay component

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

// Create a sample Activity instance
const SampleActivity = new Activity({
  activityId: "sample-activity-1", // Placeholder ID
  title: "Art Therapy Session",
  description: "A guided session to explore creativity through art.",
  tags: ["art", "therapy", "creativity"],
  instructions: [
    {
      stepNumber: 1,
      contentBlocks: [
        {
          type: "text",
          content:
            "Watch this video to learn how to create your own art masterpiece!",
          addedBy: "user123",
          applicableDisabilities: ["all"],
        },
        {
          type: "image",
          url: "https://example.com/art-image.jpg", // Replace with your image URL
          altText: "An example art image",
          addedBy: "user123",
          applicableDisabilities: ["all"],
        },
        {
          type: "video",
          url: "https://example.com/art-video.mp4", // Replace with your video URL
          description: "Art tutorial video",
          addedBy: "user123",
          applicableDisabilities: ["all"],
        },
      ],
    },
  ],
  createdBy: "user123",
  // Optional cover image
  coverImageUrl: "https://example.com/cover-image.jpg", // Replace with your cover image URL
  coverImageAltText: "Cover image description",
});

const HomeScreen = ({ navigation }: RouterProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityDisplay activity={SampleActivity} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Removed justifyContent and alignItems to allow content to scroll properly
    backgroundColor: "#f0f0f0",
  },
});

export default HomeScreen;
