import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import ActivityDetailScreen from "./screens/ActivityDetailScreen";

export type HomeStackParamList = {
  Home: undefined;
  ActivityDetail: { activityId: string };
};

const Stack = createStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
        options={{ title: "Activity Details" }}
      />
    </Stack.Navigator>
  );
}
