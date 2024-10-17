// UserProfileScreen.tsx

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import User from './models/User'; // Import your User model
import { FIREBASE_AUTH, FIREBASE_DB } from './firebaseConfig'; // Import Firestore configuration
import { doc, updateDoc } from 'firebase/firestore'; // Import necessary Firestore methods

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
      <Text style={styles.username}>{username || 'No username set'}</Text>

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
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{user.email}</Text>

        {/* Display Disability Tags if available */}
        {user.disabilityTags && user.disabilityTags.length > 0 ? (
          <>
            <Text style={styles.infoLabel}>Disability Tags:</Text>
            <FlatList
              data={user.disabilityTags}
              renderItem={({ item }) => <Text style={styles.tag}>{item}</Text>}
              keyExtractor={(item, index) => index.toString()}
            />
          </>
        ) : (
          <Text style={styles.noTagsText}>No disability tags available</Text>
        )}
        <Button
        onPress={() => FIREBASE_AUTH.signOut()}
        title="Log Out"
        color="#841584"
      />
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
    fontSize: 24,
    fontWeight: 'bold',
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
    fontSize: 16,
    color: '#555',
  },
  infoValue: {
    fontSize: 18,
    marginBottom: 12,
  },
  tag: {
    fontSize: 16,
    backgroundColor: '#e0e0e0',
    padding: 8,
    marginVertical: 4,
    borderRadius: 8,
    textAlign: 'center',
  },
  noTagsText: {
    fontSize: 16,
    color: '#888',
    marginTop: 12,
  },
});

export default UserProfileScreen;
