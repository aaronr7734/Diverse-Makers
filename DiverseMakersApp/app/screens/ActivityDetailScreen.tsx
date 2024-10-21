import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ActivityService } from "../services/ActivityService";
import Activity from "../models/Activity";
import ActivityDisplay from "../activityDisplay";
import { UserSettingsContext } from "../contexts/UserSettingsContext";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../HomeStackNavigator";
import { Text } from "react-native";

type ActivityDetailScreenProps = StackScreenProps<
  HomeStackParamList,
  "ActivityDetail"
>;

const ActivityDetailScreen: React.FC<ActivityDetailScreenProps> = ({
  route,
}) => {
  const { activityId } = route.params;
  const [activity, setActivity] = useState<Activity | null>(null);
  const { settings } = useContext(UserSettingsContext);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const fetchedActivity = await ActivityService.getActivity(activityId);
        setActivity(fetchedActivity);
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };
    fetchActivity();
  }, [activityId]);

  if (!activity) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: settings.fontSize }}>Loading Activity...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ActivityDisplay activity={activity} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ActivityDetailScreen;
