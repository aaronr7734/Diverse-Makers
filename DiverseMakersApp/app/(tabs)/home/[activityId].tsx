import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Text, useTheme, Button } from "react-native-paper";
import { ActivityService } from "../../services/ActivityService";
import Activity from "../../models/Activity";
import ActivityDisplay from "../../activityDisplay";
import { UserSettingsContext } from "../../../contexts/UserSettingsContext";
import { useLocalSearchParams, useRouter } from "expo-router";

const ActivityDetailScreen: React.FC = () => {
  const { activityId } = useLocalSearchParams<{ activityId: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useContext(UserSettingsContext);
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        if (activityId) {
          const fetchedActivity = await ActivityService.getActivity(activityId);
          setActivity(fetchedActivity);
        } else {
          throw new Error("Invalid activity ID.");
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load activity.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [activityId]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: settings.highContrast ? "#000" : "#fff",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      backgroundColor: settings.highContrast ? "#000" : "#fff",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      backgroundColor: settings.highContrast ? "#000" : "#fff",
    },
    errorText: {
      color: "red",
      textAlign: "center",
      marginBottom: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      backgroundColor: settings.highContrast ? "#000" : "#fff",
    },
    emptyText: {
      color: settings.highContrast ? "#fff" : "#555",
      textAlign: "center",
      marginBottom: 16,
    },
    button: {
      marginTop: 8,
      borderRadius: 4,
    },
    buttonContent: {
      height: 48,
      justifyContent: "center",
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          accessibilityLabel="Loading activity"
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text
          style={[styles.errorText, { fontSize: settings.fontSize }]}
          accessibilityRole="alert"
        >
          {error}
        </Text>
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={{
            color: theme.colors.onPrimary,
            fontSize: settings.fontSize,
          }}
          accessibilityLabel="Go back"
        >
          Go Back
        </Button>
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={styles.emptyContainer}>
        <Text
          style={[styles.emptyText, { fontSize: settings.fontSize }]}
          accessibilityRole="text"
        >
          Activity not found.
        </Text>
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={{
            color: theme.colors.onPrimary,
            fontSize: settings.fontSize,
          }}
          accessibilityLabel="Go back"
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ActivityDisplay activity={activity} />
    </ScrollView>
  );
};

export default ActivityDetailScreen;
