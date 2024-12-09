import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Image, Pressable, FlatList } from "react-native";
import { Text } from "react-native-paper";
import { UserSettingsContext } from "../../../contexts/UserSettingsContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { useRouter } from "expo-router";
import { ActivityService } from "../../../services/ActivityService";
import  Activity  from "../../models/Activity"; // Ensure correct path for Activity model

const UserProfileScreen: React.FC = () => {
  const { settings } = useContext(UserSettingsContext);
  const { user } = useContext(AuthContext);
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserActivities = async () => {
      if (user) {
        try {
          const allActivities = await ActivityService.getAllActivities();
          const createdActivities = allActivities.filter(
            (activity: Activity) => activity.getCreatedBy() === user.userId
          );
          setUserActivities(createdActivities);
        } catch (error) {
          console.error("Error fetching activities:", error);
        }
      }
    };

    fetchUserActivities();
  }, [user]);

  if (!user) {
    return (
      <View
        style={[
          styles.centeredContainer,
          { backgroundColor: settings.highContrast ? "#000" : "#fff" },
        ]}
      >
        <Text
          style={[
            styles.errorText,
            {
              fontSize: settings.fontSize,
              color: settings.highContrast ? "#fff" : "#000",
            },
          ]}
          accessibilityRole="alert"
        >
          User not found.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: settings.highContrast ? "#000" : "#fff" },
      ]}
    >
      {/* Profile Image */}
      <Image
        source={require("../../assets/default-profile.png")}
        style={styles.profileImage}
        accessible
        accessibilityLabel="Profile Picture"
      />
      {/* Username */}
      <Text
        style={[
          styles.username,
          {
            fontSize: settings.fontSize + 4,
            color: settings.highContrast ? "#fff" : "#000",
          },
        ]}
        accessibilityRole="header"
      >
        {user.username || "No Username"}
      </Text>
      {/* Email */}
      <Text
        style={[
          styles.email,
          {
            fontSize: settings.fontSize,
            color: settings.highContrast ? "#fff" : "#555",
          },
        ]}
        accessibilityRole="text"
      >
        {user.email}
      </Text>
      {/* Disability Tags */}
      {user.disabilityTags && user.disabilityTags.length > 0 ? (
        <View style={styles.tagsContainer}>
          {user.disabilityTags.map((tag: string, index: number) => (
            <Text
              key={index}
              style={[
                styles.tag,
                {
                  fontSize: settings.fontSize - 2,
                  backgroundColor: settings.highContrast ? "#fff" : "#e0e0e0",
                  color: settings.highContrast ? "#000" : "#333",
                },
              ]}
              accessible
              accessibilityLabel={`Disability tag: ${tag}`}
            >
              {tag}
            </Text>
          ))}
        </View>
      ) : (
        <Text
          style={[
            styles.noTagsText,
            {
              fontSize: settings.fontSize - 2,
              color: settings.highContrast ? "#fff" : "#555",
            },
          ]}
          accessibilityRole="text"
        >
          No Disability Tags
        </Text>
      )}
      {/* Edit Profile Button */}
      <Pressable
        style={[
          styles.editButton,
          {
            backgroundColor: settings.highContrast ? "#fff" : "#6200ee",
            borderColor: settings.highContrast ? "#fff" : "#6200ee",
          },
        ]}
        onPress={() => router.push("/profile/edit")}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Edit Profile"
      >
        <Text
          style={{
            color: settings.highContrast ? "#000" : "#fff",
            fontSize: settings.fontSize,
            textAlign: "center",
            paddingVertical: 12,
          }}
        >
          Edit Profile
        </Text>
      </Pressable>
      {/* List of User's Activities */}
      <Text
        style={[
          styles.sectionTitle,
          { fontSize: settings.fontSize + 2, color: settings.highContrast ? "#fff" : "#000" },
        ]}
      >
        My Activities
      </Text>
      <FlatList
        data={userActivities}
        keyExtractor={(item) => item.getActivityId()}
        renderItem={({ item }) => (
          <View style={styles.activityItem}>
            <Text
              style={{
                fontSize: settings.fontSize,
                color: settings.highContrast ? "#fff" : "#000",
              }}
            >
              {item.getTitle()}
            </Text>
            <Text
              style={{
                fontSize: settings.fontSize - 2,
                color: settings.highContrast ? "#aaa" : "#555",
              }}
            >
              {item.getDescription()}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text
            style={{
              fontSize: settings.fontSize,
              color: settings.highContrast ? "#fff" : "#555",
              textAlign: "center",
              marginTop: 20,
            }}
          >
            No activities created yet.
          </Text>
        }
      />
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    textAlign: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: "#6200ee",
  },
  username: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  email: {
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
    justifyContent: "center",
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    margin: 4,
  },
  noTagsText: {
    marginBottom: 24,
    textAlign: "center",
  },
  editButton: {
    width: "80%",
    borderRadius: 4,
    borderWidth: 1,
  },
  sectionTitle: {
    marginTop: 20,
    fontWeight: "bold",
  },
  activityItem: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    width: "100%",
  },
});
