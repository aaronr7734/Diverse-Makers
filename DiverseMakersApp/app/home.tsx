// HomeScreen.tsx
import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { FIREBASE_AUTH } from './firebaseConfig';

interface RouterProps {
    navigation: NavigationProp<any, any>; 
}

const HomeScreen = ({ navigation }: RouterProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      <Button
        onPress={() => FIREBASE_AUTH.signOut()}
        title="Log Out"
        color="#841584"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default HomeScreen;
