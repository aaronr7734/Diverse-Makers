// Import Firebase Timestamp for time-related fields
import { Timestamp } from "firebase/firestore";

// Define the structure for media items within the activity
type MediaItem = {
  type: "video" | "image" | "link"; // Only allow these specific media types
  url: string; // URL to the media item (video, image, or link)
  description?: string; // Alt Text for the image or a video description.
};

// Define the structure for the activity instructions
type Instructions = {
  [disabilityType: string]: string; // Maps each disability type to specific instructions
};

// Define the structure for rating summary, to be implemented later.
type RatingSummary = {
  averageRating: number; // Average rating for the activity
  totalRatings: number; // Total number of ratings received
};

// Define the Activity class with TypeScript
export default class Activity {
  title: string;
  description: string;
  tags: string[];
  instructions: Instructions;
  createdBy: string;
  mediaUrls: MediaItem[];
  timestamp: Timestamp;
  commentCount: number;

  // Constructor initializes all the required fields for an activity
  constructor({
    title,
    description,
    tags = [],
    instructions = {},
    createdBy,
    mediaUrls = [],
  }: {
    title: string;
    description: string;
    tags?: string[];
    instructions?: Instructions;
    createdBy: string;
    mediaUrls?: MediaItem[];
  }) {
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.instructions = instructions;
    this.createdBy = createdBy;
    this.mediaUrls = mediaUrls;
    this.timestamp = Timestamp.now(); // Automatically set to current time when created
    this.commentCount = 0; // Initialize comment count to zero
  }

  // Method to convert the Activity instance into an object compatible with Firestore
  toFirestoreFormat() {
    return {
      title: this.title,
      description: this.description,
      tags: this.tags,
      instructions: this.instructions,
      createdBy: this.createdBy,
      mediaUrls: this.mediaUrls,
      timestamp: this.timestamp,
      commentCount: this.commentCount,
    };
  }
}
