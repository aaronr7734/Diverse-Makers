import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStackNavigator from "./HomeStackNavigator";
import ProfileContainer from "./screens/ProfileContainer";
import SettingsScreen from "./screens/SettingsScreen";
import { Ionicons } from "@expo/vector-icons";
import User from "./models/User";

export type MainTabParamList = {
  HomeTab: undefined;
  Profile: { user: User };
  Settings: undefined;
};

// Create the Bottom Tab Navigator
const Tab = createBottomTabNavigator<MainTabParamList>();

// Define the type for Ionicons' name prop based on Ionicons component's props
type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

// 4. Update the MainTabNavigator component to stop expecting `route` as a prop
const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: IoniconName = "home-outline"; // Default icon

          if (route.name === "HomeTab") {
            iconName = "home-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          } else if (route.name === "Settings") {
            iconName = "settings-outline";
          }

          return <Ionicons name={iconName} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: "Home",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileContainer}
        options={{
          title: "Profile",
        }}
        // We will pass user via initialParams when this Tab.Navigator is mounted
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
