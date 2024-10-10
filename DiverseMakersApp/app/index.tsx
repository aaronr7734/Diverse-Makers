import { Text, View, Button } from "react-native";
import { initializeApp } from 'firebase/app';
import {getFirestore, collection, getDocs, Firestore, doc, setDoc} from 'firebase/firestore/lite';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button
            onPress={() => addUser(db, "TestUser2", "TestUsername2")}
            title="Get Users"
            color="#841584"
          />
    </View>
  );
}


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
