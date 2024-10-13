import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import User from "../models/User";

// Sign In Function
export const signIn = async (email: string, password: string) => {
  try {
    const response = await signInWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password
    );
    console.log("Sign In Successful:", response);
    return response;
  } catch (error: any) {
    console.error("Sign In Error:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

// Sign Up Function
export const signUp = async (email: string, password: string) => {
  try {
    // Create the user with Firebase Auth
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password
    );
    const user = userCredential.user;

    // Create a user profile in Firestore
    const userProfile = new User({
      userId: user.uid,
      email: user.email || "",
    });

    await setDoc(
      doc(FIREBASE_DB, "users", user.uid),
      userProfile.toFirestoreFormat()
    );

    console.log("User profile created with ID:", user.uid);
    return userCredential;
  } catch (error: any) {
    console.error("Sign Up Error:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
