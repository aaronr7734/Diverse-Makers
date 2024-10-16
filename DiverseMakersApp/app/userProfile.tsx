// UserProfileScreen.tsx

import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import User from './models/User'; // Import the User model

// Interface for the props that this component will receive
interface UserProfileProps {
  user: User; // Assume a user instance is passed as a prop
}

const UserProfileScreen = ({ user }: UserProfileProps) => {
  return (
    <View style={styles.container}>
      {/* Profile Picture Placeholder */}
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }}
        style={styles.profileImage}
      />

      {/* Username */}
      <Text style={styles.username}>{user.username || 'No username set'}</Text>

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
