// UserProfileScreen.tsx

import React, { useState } from 'react';
import { View, Image, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import User from './models/User'; // Import your User model
import { FIREBASE_AUTH, FIREBASE_DB } from './firebaseConfig'; // Import Firestore configuration
import { doc, updateDoc } from 'firebase/firestore'; // Import necessary Firestore methods
import { ThemedText } from '@/components/ThemedText';

interface UserProfileProps {
  user: User; // Assume a user instance is passed as a prop
}

const UserProfileScreen = ({ user }: UserProfileProps) => {
  const [username, setUsername] = useState(user.username || '');
  const [isEditing, setIsEditing] = useState(false); // State to control visibility of input field

  const handleSaveUsername = async () => {
    if (user.userId) {
      const userDocRef = doc(FIREBASE_DB, 'users', user.userId);
      try {
        await updateDoc(userDocRef, { username });
        alert('Username updated successfully!');
        setIsEditing(false); // Hide the input field after saving
      } catch (error) {
        console.error('Error updating username:', error);
        alert('Failed to update username.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture Placeholder */}
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }}
        style={styles.profileImage}
      />

      {/* Current Username Display */}
      <ThemedText type="title" style={styles.username}>
        {username || 'No username set'}
      </ThemedText>

      {/* Button to Change Username */}
      <Button title="Change Username" onPress={() => setIsEditing(!isEditing)} />

      {/* Conditional rendering of the input field for changing username */}
      {isEditing && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter new username"
            value={username}
            onChangeText={setUsername}
          />
          <Button title="Save" onPress={handleSaveUsername} />
        </>
      )}

      {/* Email */}
      <View style={styles.infoContainer}>
        <ThemedText type="defaultSemiBold" style={styles.infoLabel}>
          Email:
        </ThemedText>
        <ThemedText style={styles.infoValue}>{user.email}</ThemedText>

        {/* Display Disability Tags if available */}
        {user.disabilityTags && user.disabilityTags.length > 0 ? (
          <>
            <ThemedText type="defaultSemiBold" style={styles.infoLabel}>
              Disability Tags:
            </ThemedText>
            <FlatList
              data={user.disabilityTags}
              renderItem={({ item }) => (
                <ThemedText style={styles.tag}>{item}</ThemedText>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </>
        ) : (
          <ThemedText style={styles.noTagsText}>
            No disability tags available
          </ThemedText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 16,
  },
  username: {
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 32,
  },
  infoLabel: {
    color: '#555',
  },
  infoValue: {
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    marginVertical: 4,
    borderRadius: 8,
    textAlign: 'center',
  },
  noTagsText: {
    color: '#888',
    marginTop: 12,
  },
});

export default UserProfileScreen;
