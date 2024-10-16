import { Text, View, Button } from "react-native";
import { collection, doc, setDoc } from "firebase/firestore/lite";
import { PaperProvider } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import Login from "./login";
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB } from "./firebaseConfig";
import HomeScreen from "./home";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
  <InsideStack.Navigator> 

    <InsideStack.Screen name = "Home" component={HomeScreen} />

  </InsideStack.Navigator>
  );
}

export default function Index() {

  const [user, setUser] = useState<User | null >(null);

  // set active user 
  useEffect(() =>  {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user); 
      setUser(user); 
    }); 

  }, [])

  return (
    <PaperProvider>
      {/* <View
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
      </View> */}
      <Button
        onPress={() => addUser("TestUser2", "TestUsername2")}
        title="Get Users"
        color="#841584"
      />
      <Stack.Navigator initialRouteName="login">
        {user ? (<Stack.Screen
          name="login"
          component={InsideLayout}
          options={{ headerShown: false }}
        />) : 
        
        (<Stack.Screen
          name="login"
          component={Login}
          options={{ headerShown: false }}
        />) }
        
      </Stack.Navigator>
    </PaperProvider>
  );
}

async function getUsers() {
  const usersCol = collection(FIREBASE_DB, "users");
  //const userSnapshot = await getDocs(usersCol);
  console.log(usersCol);
}

async function addUser(userId: string, usernameToAdd: string) {
  // create a user in users collection with TestUser doc ID
  await setDoc(doc(FIREBASE_DB, "users", userId), {
    // set username to test username
    username: usernameToAdd,
  });
}
