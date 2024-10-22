// ProfileContainer.tsx

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig'; // Import Firestore and Auth services
import UserProfileScreen from '../userProfile'; // Import your UserProfileScreen component
import User from '../models/User'; // Import your User model
import { doc, getDoc } from "firebase/firestore"; // Import the necessary Firestore methods
import { ThemedText } from '@/components/ThemedText'; // Import ThemedText

// Fetch user profile from Firestore based on UID
const fetchUserProfile = async (uid: string) => {
  try {
    // Get the document reference for the user
    const userDocRef = doc(FIREBASE_DB, 'users', uid);

    // Fetch the document
    const userDoc = await getDoc(userDocRef);

    // Check if the document exists and return the data
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return new User({
        userId: userData?.userId,
        email: userData?.email,
        username: userData?.username,
        disabilityTags: userData?.disabilityTags || [],
      });
    } else {
      console.log('No such user!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

const ProfileContainer = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        const userData = await fetchUserProfile(currentUser.uid);  // Fetch from Firestore
        setUser(userData);
      }
      setLoading(false);  // Data fetch complete
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Loading user profile...</ThemedText>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>No user profile found</ThemedText>
      </View>
    );
  }

  return <UserProfileScreen user={user} />;
};

export default ProfileContainer;
