import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Text, Card, useTheme, Button } from "react-native-paper";
import { ActivityService } from "../../services/ActivityService";
import Activity from "../../models/Activity";
import { UserSettingsContext } from "../../../contexts/UserSettingsContext";
import { Link } from "expo-router";

const HomeScreen: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useContext(UserSettingsContext);
  const theme = useTheme();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const fetchedActivities = await ActivityService.getAllActivities();
        // Filter out any activities with invalid instructions
        const validActivities = fetchedActivities.filter((activity) => {
          const instructions = activity.getInstructions();
          return Array.isArray(instructions);
        });
        setActivities(validActivities);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load activities.";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: settings.highContrast ? "#000" : "#fff",
    },
    listContent: {
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    card: {
      marginBottom: 24,
      elevation: 2,
      backgroundColor: settings.highContrast ? "#000" : "#fff",
      borderRadius: 8,
      overflow: "hidden",
    },
    coverImage: {
      height: 180,
      width: "100%",
    },
    contentContainer: {
      padding: 16,
    },
    title: {
      marginBottom: 8,
      fontWeight: "bold",
      color: settings.highContrast ? "#fff" : "#333",
    },
    description: {
      color: settings.highContrast ? "#fff" : "#555",
      marginBottom: 12,
    },
    goToActivityButton: {
      alignSelf: "flex-start",
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    goToActivityText: {
      color: theme.colors.primary,
      fontSize: settings.fontSize,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: settings.highContrast ? "#000" : "#fff",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
      backgroundColor: settings.highContrast ? "#000" : "#fff",
    },
    errorText: {
      color: "red",
      textAlign: "center",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
      backgroundColor: settings.highContrast ? "#000" : "#fff",
    },
    emptyText: {
      color: settings.highContrast ? "#fff" : "#555",
      textAlign: "center",
    },
  });

  /**
   * Renders each activity item in the list.
   * @param item - The activity to render.
   */
  const renderItem = ({ item }: { item: Activity }) => (
    <Card style={styles.card} accessible accessibilityRole="summary">
      {item.getCoverImageUrl() ? (
        <Image
          source={{ uri: item.getCoverImageUrl() }}
          style={styles.coverImage}
          accessible
          accessibilityLabel={
            item.getCoverImageAltText() || `${item.getTitle()} Cover Image`
          }
        />
      ) : null}
      <View style={styles.contentContainer}>
        {/* Activity Title as Heading */}
        <Text
          style={[styles.title, { fontSize: settings.fontSize + 4 }]}
          accessibilityRole="header"
        >
          {item.getTitle()}
        </Text>
        {/* Activity Description */}
        <Text
          style={[styles.description, { fontSize: settings.fontSize }]}
          accessibilityRole="text"
        >
          {item.getDescription()}
        </Text>
        {/* "Go to Activity" Link */}
        <Link
          href={{
            pathname: "/home/[activityId]",
            params: { activityId: item.getActivityId() },
          }}
          asChild
        >
          <TouchableOpacity
            style={styles.goToActivityButton}
            accessible
            accessibilityRole="link"
            accessibilityLabel={`Go to activity: ${item.getTitle()}`}
            accessibilityHint={`Navigates to the details of ${item.getTitle()}`}
          >
            <Text style={styles.goToActivityText}>Go to Activity</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </Card>
  );

  /**
   * Displays a loading indicator while activities are being fetched.
   */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          accessibilityLabel="Loading activities"
        />
      </View>
    );
  }

  /**
   * Displays an error message if fetching activities fails.
   */
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text
          style={[styles.errorText, { fontSize: settings.fontSize }]}
          accessibilityRole="alert"
        >
          {error}
        </Text>
      </View>
    );
  }

  /**
   * Displays a message if there are no activities available.
   */
  if (activities.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text
          style={[styles.emptyText, { fontSize: settings.fontSize }]}
          accessible
          accessibilityRole="text"
        >
          No activities available at the moment.
        </Text>
      </View>
    );
  }

  /**
   * Renders the list of activities.
   */
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

export default HomeScreen;
