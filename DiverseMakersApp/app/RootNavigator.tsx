import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import MainTabNavigator from "./MainTabNavigator";
import EditProfileScreen from "./screens/EditProfileScreen";
import User from "./models/User"; // Ensure correct import path

// Define RootStackParamList
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Main: { user: User }; // Add user as a param for Main
  EditProfile: { user: User };
};

// Create the Stack Navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

interface Props {
  user: User | null;
}

const RootNavigator: React.FC<Props> = ({ user }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            initialParams={{ user }} // Pass user as initialParams
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ headerShown: true, title: "Edit Profile" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
