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
import { Text, Card, useTheme } from "react-native-paper";
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
      marginBottom: 16,
      elevation: 2,
      backgroundColor: settings.highContrast ? "#000" : "#fff",
    },
    coverImage: {
      height: 200,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
    },
    title: {
      marginTop: 8,
      fontWeight: "bold",
      color: settings.highContrast ? "#fff" : "#333",
    },
    description: {
      marginTop: 4,
      color: settings.highContrast ? "#fff" : "#555",
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

  const renderItem = ({ item }: { item: Activity }) => (
    <Link
      href={{
        pathname: "/home/[activityId]",
        params: { activityId: item.getActivityId() },
      }}
      asChild
    >
      <TouchableOpacity
        accessible
        accessibilityLabel={`View details for ${item.getTitle()}`}
        accessibilityHint="Navigates to activity details"
      >
        <Card style={styles.card}>
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
          <Card.Content>
            <Text
              style={[styles.title, { fontSize: settings.fontSize + 4 }]}
              numberOfLines={1}
              accessible
            >
              {item.getTitle()}
            </Text>
            <Text
              style={[styles.description, { fontSize: settings.fontSize }]}
              numberOfLines={2}
              accessible
            >
              {item.getDescription()}
            </Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Link>
  );

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
