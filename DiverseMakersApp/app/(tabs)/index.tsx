import { Image, StyleSheet, Platform, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { initializeApp } from 'firebase/app';
import {getFirestore, collection, getDocs, Firestore, doc, setDoc} from 'firebase/firestore/lite';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
          <Button
            onPress={() => addUser(db, "TestUser2", "TestUsername2")}
            title="Get Users"
            color="#841584"
          />
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAx7MuAXIi4NJ4ojBXpUdSUOqWuZ1bdpro",
  authDomain: "diverse-makers-75a07.firebaseapp.com",
  projectId: "diverse-makers-75a07",
  storageBucket: "diverse-makers-75a07.appspot.com",
  messagingSenderId: "698948403539",
  appId: "1:698948403539:web:92c9f2c6a520eb860161a6",
  measurementId: "G-S3PKZDZQ5Z"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 

async function getUsers(db: Firestore) {
  const usersCol = collection(db, 'users'); 
  //const userSnapshot = await getDocs(usersCol); 
  console.log(usersCol);
  
}

async function addUser(db: Firestore, userId: string, usernameToAdd: string) {
  // create a user in users collection with TestUser doc ID
  await setDoc(doc(db, 'users', userId), {
    // set username to test username
    username: usernameToAdd
  });
  
  
}
