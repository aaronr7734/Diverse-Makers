// Import Firebase Timestamp for time-related fields
import { Timestamp } from "firebase/firestore";

// Define the User class with optional fields that can be expanded later
export default class User {
  userId: string;
  email: string;
  createdAt: Timestamp;
  // Optional fields to be added later
  username?: string;
  disabilityTags?: string[];

  // Constructor initializes all the required fields for a user profile
  constructor({
    userId,
    email,
    username = "",
    disabilityTags = [],
  }: {
    userId: string;
    email: string;
    username?: string;
    disabilityTags?: string[];
  }) {
    this.userId = userId;
    this.email = email;
    this.username = username || undefined;
    this.disabilityTags = disabilityTags.length ? disabilityTags : undefined;
    this.createdAt = Timestamp.now();
  }

  // Method to convert the User instance into an object compatible with Firestore
  toFirestoreFormat() {
    return {
      userId: this.userId,
      email: this.email,
      username: this.username,
      disabilityTags: this.disabilityTags,
      createdAt: this.createdAt,
    };
  }
}
