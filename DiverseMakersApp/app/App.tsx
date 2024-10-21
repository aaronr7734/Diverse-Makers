import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./firebaseConfig";
import RootNavigator from "./RootNavigator";
import User from "./models/User";
import { Timestamp } from "firebase/firestore";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (firebaseUser) => {
      if (firebaseUser) {
        // Convert the Firebase metadata creationTime to a Timestamp
        const createdAt = firebaseUser.metadata.creationTime
          ? Timestamp.fromDate(new Date(firebaseUser.metadata.creationTime)) // Convert to Timestamp
          : Timestamp.now(); // Default to the current Timestamp if not available

        // Create an instance of User class from Firebase user data
        const customUser = new User({
          userId: firebaseUser.uid, // Map Firebase UID to userId
          email: firebaseUser.email || "", // Ensure email is a string
          createdAt: createdAt, // Use the Timestamp for createdAt
          username: firebaseUser.displayName || undefined, // Use displayName for username if available
        });

        setUser(customUser); // Set the transformed user
      } else {
        setUser(null); // No user is signed in
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <RootNavigator user={user} />
      </NavigationContainer>
    </PaperProvider>
  );
}
