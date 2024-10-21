import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Text, Card } from "react-native-paper";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../HomeStackNavigator";
import { ActivityService } from "../services/ActivityService";
import Activity from "../models/Activity";
import { UserSettingsContext } from "../contexts/UserSettingsContext";

type HomeScreenProps = StackScreenProps<HomeStackParamList, "Home">;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { settings } = useContext(UserSettingsContext);

  useEffect(() => {
    const fetchActivities = async () => {
      const fetchedActivities = await ActivityService.getAllActivities();
      setActivities(fetchedActivities);
    };
    fetchActivities();
  }, []);

  const renderItem = ({ item }: { item: Activity }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ActivityDetail", {
          activityId: item.getActivityId(),
        })
      }
      accessible
      accessibilityLabel={`View details for ${item.getTitle()}`}
    >
      <Card style={styles.card}>
        {item.getCoverImageUrl() && (
          <Image
            source={{ uri: item.getCoverImageUrl() }}
            style={styles.coverImage}
            accessible
            accessibilityLabel={item.getCoverImageAltText() || "Cover Image"}
          />
        )}
        <Card.Content>
          <Text style={[styles.title, { fontSize: settings.fontSize + 4 }]}>
            {item.getTitle()}
          </Text>
          <Text style={[styles.description, { fontSize: settings.fontSize }]}>
            {item.getDescription()}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.getActivityId()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        accessible
        accessibilityLabel="List of STEM activities"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  listContent: {
    paddingVertical: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: "#fff",
  },
  coverImage: {
    height: 200,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  title: {
    marginTop: 8,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    marginTop: 4,
    color: "#555",
  },
});

export default HomeScreen;
