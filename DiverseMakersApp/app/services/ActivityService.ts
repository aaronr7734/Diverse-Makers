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
  Timestamp,
} from "firebase/firestore";
import Activity from "../models/Activity";

export class ActivityService {
  /**
   * Adds a new Activity to Firestore and assigns the generated ID to activityId.
   * @param activity The Activity instance to add.
   */
  public static async addActivity(activity: Activity): Promise<void> {
    const data = activity.toFirestoreFormat();
    delete data.activityId;

    const docRef = await addDoc(collection(FIREBASE_DB, "activities"), data);

    const generatedId = docRef.id;

    activity.setActivityId(generatedId);

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

      const timestamp =
        data.timestamp instanceof Timestamp
          ? data.timestamp
          : Timestamp.fromDate(new Date(data.timestamp));

      const activity = new Activity({
        activityId: data.activityId,
        title: data.title,
        description: data.description,
        tags: data.tags || [],
        instructions: data.instructions || [],
        createdBy: data.createdBy,
        coverImageUrl: data.coverImageUrl || undefined,
        coverImageAltText: data.coverImageAltText || undefined,
        timestamp: timestamp,
        commentCount: data.commentCount || 0,
      });

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

      const timestamp =
        data.timestamp instanceof Timestamp
          ? data.timestamp
          : Timestamp.fromDate(new Date(data.timestamp));

      const activity = new Activity({
        activityId: data.activityId,
        title: data.title,
        description: data.description,
        tags: data.tags || [],
        instructions: data.instructions || [],
        createdBy: data.createdBy,
        coverImageUrl: data.coverImageUrl || undefined,
        coverImageAltText: data.coverImageAltText || undefined,
        timestamp: timestamp,
        commentCount: data.commentCount || 0,
      });

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
