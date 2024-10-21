import React from "react";
import UserProfileScreen from "./UserProfileScreen";
import { RouteProp } from "@react-navigation/native";
import { MainTabParamList } from "../MainTabNavigator";
import User from "../models/User";

// Define the props for ProfileContainer
interface ProfileContainerProps {
  route: RouteProp<MainTabParamList, "Profile">; // Using route to get params
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({ route }) => {
  const { user } = route.params; // Access user from route params
  return <UserProfileScreen user={user} />;
};

export default ProfileContainer;
