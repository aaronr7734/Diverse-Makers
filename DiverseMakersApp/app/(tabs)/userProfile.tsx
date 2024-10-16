// UserProfileScreen.js

import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';

const UserProfileScreen = () => {
  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }}
        style={styles.profileImage}
      />

      {/* Username */}
      <Text style={styles.username}>John Doe</Text>

      {/* User Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>johndoe@example.com</Text>

        <Text style={styles.infoLabel}>Phone:</Text>
        <Text style={styles.infoValue}>+123 456 7890</Text>
      </View>

      {/* Edit Profile Button */}
      <Button title="Edit Profile" onPress={() => {}} />
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
});

export default UserProfileScreen;
