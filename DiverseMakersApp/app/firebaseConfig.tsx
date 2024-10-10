import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth"; 
import {getFirestore } from 'firebase/firestore/lite';


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

  export const FIREBASE_APP = initializeApp(firebaseConfig);
  export const FIREBASE_DB = getFirestore(FIREBASE_APP);
  export const FIREBASE_AUTH = getAuth(FIREBASE_APP); 
