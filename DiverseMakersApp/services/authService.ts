import { FIREBASE_AUTH, FIREBASE_DB } from "../app/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import User from "../app/models/User";

/**
 * Sign In Function
 * Authenticates a user with Firebase Auth.
 * @param email - User's email address.
 * @param password - User's password.
 */
export const signIn = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    // Authenticate user with Firebase Auth
    await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
    // The AuthContext will handle fetching the user profile
  } catch (error: any) {
    console.error("Sign In Error:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

/**
 * Sign Up Function
 * Creates a new user and initializes their profile in Firestore.
 * @param email - User's email address.
 * @param password - User's password.
 */
export const signUp = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    // Create the user with Firebase Auth
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password
    );
    const user = userCredential.user;

    // Initialize user profile with the User model
    const userProfile = new User({
      userId: user.uid,
      email: user.email || "",
      username: "", // You can collect this from additional sign-up fields if needed
      disabilityTags: [], // Initialize with empty array or collect from additional sign-up fields
      createdAt: Timestamp.now(),
    });

    // Store user profile in Firestore
    await setDoc(
      doc(FIREBASE_DB, "users", user.uid),
      userProfile.toFirestoreFormat()
    );

    console.log("User profile created with ID:", user.uid);
    // The AuthContext will handle fetching the user profile
  } catch (error: any) {
    console.error("Sign Up Error:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
