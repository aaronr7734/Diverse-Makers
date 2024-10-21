import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import User from "../models/User";

/**
 * Sign In Function
 * Authenticates a user and retrieves their profile from Firestore.
 * @param email - User's email address.
 * @param password - User's password.
 * @returns A Promise that resolves to a User instance.
 */
export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    // Authenticate user with Firebase Auth
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password
    );

    const user = userCredential.user;

    // Fetch user profile from Firestore
    const userDocRef = doc(FIREBASE_DB, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const userProfile = User.fromFirestore(userData);
      return userProfile;
    } else {
      throw new Error("No user profile found in Firestore.");
    }
  } catch (error: any) {
    console.error("Sign In Error:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

/**
 * Sign Up Function
 * Creates a new user, initializes their profile in Firestore, and returns the User instance.
 * @param email - User's email address.
 * @param password - User's password.
 * @returns A Promise that resolves to a User instance.
 */
export const signUp = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    // Create the user with Firebase Auth
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password
    );
    const user = userCredential.user;

    // Initialize user profile with the updated User model
    const userProfile = new User({
      userId: user.uid,
      email: user.email || "",
      username: "", // Initialize with empty string or collect from additional sign-up fields
      disabilityTags: [], // Initialize with empty array or collect from additional sign-up fields
      createdAt: Timestamp.now(),
    });

    // Store user profile in Firestore
    await setDoc(
      doc(FIREBASE_DB, "users", user.uid),
      userProfile.toFirestoreFormat()
    );

    console.log("User profile created with ID:", user.uid);
    return userProfile;
  } catch (error: any) {
    console.error("Sign Up Error:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
