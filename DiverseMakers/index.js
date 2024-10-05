/**
 * @format
 */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {getAuth, EmailAuthProvider } from "firebase/auth";
import {} from 'firebase/firestore';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import * as firebaseui from 'firebaseui';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
auth = getAuth();
const analytics = getAnalytics(app);
export const db = getFirestore();
AppRegistry.registerComponent(appName, () => App);

async function main() {

    // FirebaseUI config
    const uiConfig = {
        credentialHelper: firebaseui.auth.CredentialHelper.NONE,
        signInOptions: [
        // Email / Password Provider.
        EmailAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // Handle sign-in.
            // Return false to avoid redirect.
            return false;
            },
        },
    };
    const ui = new firebaseui.auth.AuthUI(auth);

}

main();
