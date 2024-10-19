import { FIREBASE_DB } from "../firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import Activity from "../models/Activity";

export class ActivityService {
  /**
   * Adds a new Activity to Firestore and assigns the generated ID to activityId.
   * @param activity The Activity instance to add.
   */
  public static async addActivity(activity: Activity): Promise<void> {
    // Serialize the activity, excluding activityId
    const data = activity.toFirestoreFormat();
    delete data.activityId; // Remove activityId since Firestore will generate it

    // Add the activity data to Firestore
    const docRef = await addDoc(collection(FIREBASE_DB, "activities"), data);

    // Get the generated document ID
    const generatedId = docRef.id;

    // Update the activity's activityId property
    activity.setActivityId(generatedId);

    // Update the activityId field in Firestore
    await updateDoc(docRef, { activityId: generatedId });
  }

  /**
   * Retrieves an Activity by its activityId from Firestore.
   * @param activityId The ID of the activity to retrieve.
   */
  public static async getActivity(activityId: string): Promise<Activity> {
    const docRef = doc(FIREBASE_DB, "activities", activityId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Create an Activity instance from the retrieved data
      const activity = new Activity({
        activityId: data.activityId,
        title: data.title,
        description: data.description,
        tags: data.tags,
        instructions: data.instructions,
        createdBy: data.createdBy,
        coverImageUrl: data.coverImageUrl,
        coverImageAltText: data.coverImageAltText,
      });
      // Set timestamp and commentCount
      activity.setTimestamp(data.timestamp);
      activity.setCommentCount(data.commentCount);

      return activity;
    } else {
      throw new Error("Activity not found");
    }
  }

  /**
   * Retrieves all Activities from Firestore.
   */
  public static async getAllActivities(): Promise<Activity[]> {
    const querySnapshot = await getDocs(collection(FIREBASE_DB, "activities"));
    const activities: Activity[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const activity = new Activity({
        activityId: data.activityId,
        title: data.title,
        description: data.description,
        tags: data.tags,
        instructions: data.instructions,
        createdBy: data.createdBy,
        coverImageUrl: data.coverImageUrl,
        coverImageAltText: data.coverImageAltText,
      });
      // Set timestamp and commentCount
      activity.setTimestamp(data.timestamp);
      activity.setCommentCount(data.commentCount);

      activities.push(activity);
    });
    return activities;
  }

  /**
   * Updates an existing Activity in Firestore.
   * @param activity The Activity instance to update.
   */
  public static async updateActivity(activity: Activity): Promise<void> {
    const docRef = doc(FIREBASE_DB, "activities", activity.getActivityId());
    await setDoc(docRef, activity.toFirestoreFormat());
  }

  /**
   * Deletes an Activity from Firestore by its activityId.
   * @param activityId The ID of the activity to delete.
   */
  public static async deleteActivity(activityId: string): Promise<void> {
    const docRef = doc(FIREBASE_DB, "activities", activityId);
    await deleteDoc(docRef);
  }
}
