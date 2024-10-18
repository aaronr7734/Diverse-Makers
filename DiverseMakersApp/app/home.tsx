// HomeScreen.tsx
import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { FIREBASE_AUTH } from './firebaseConfig';
import Activity from "./models/Activity"; // Import your Activity class
import ActivityDisplay from "./models/activityDisplay"; // Import your ActivityDisplay component

const SampleActivity: Activity = new Activity({
  title: "Art Therapy Session",
  description: "A guided session to explore creativity through art.",
  tags: ["art", "therapy", "creativity"],
  instructions: {
    visual: "Follow the steps outlined in the video.",
    hearing: "Listen carefully to the instructions provided.",
  },
  createdBy: "user123",
  mediaUrls: [
    { type: "image", url: "https://example.com/art-image.jpg", description: "Art Sample" },
    { type: "video", url: "https://example.com/art-video.mp4", description: "Watch the art session" },
  ],
});
interface RouterProps {
    navigation: NavigationProp<any, any>; 
}

const HomeScreen = ({ navigation }: RouterProps) => {
  return (
    <View style={styles.container}>
      <ActivityDisplay activity={SampleActivity} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default HomeScreen;
