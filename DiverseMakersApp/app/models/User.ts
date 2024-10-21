import { Timestamp } from "firebase/firestore";

/**
 * Represents a user in the application.
 */
export default class User {
  // Private properties to enforce encapsulation
  private _userId: string;
  private _email: string;
  private _createdAt: Timestamp;
  private _username?: string;
  private _disabilityTags?: string[];

  /**
   * Creates a new User instance.
   * @param params - The parameters to initialize the user.
   */
  constructor(params: {
    userId: string;
    email: string;
    username?: string;
    disabilityTags?: string[];
    createdAt?: Timestamp;
  }) {
    const { userId, email, username, disabilityTags, createdAt } = params;

    if (!userId) {
      throw new Error("userId is required");
    }

    if (!email) {
      throw new Error("email is required");
    }

    this._userId = userId;
    this._email = email;
    this._username = username;
    this._disabilityTags =
      disabilityTags && disabilityTags.length > 0 ? disabilityTags : undefined;
    this._createdAt = createdAt || Timestamp.now();
  }

  // -------------------------
  // Getters
  // -------------------------

  /**
   * Gets the user ID.
   */
  public get userId(): string {
    return this._userId;
  }

  /**
   * Gets the user's email.
   */
  public get email(): string {
    return this._email;
  }

  /**
   * Gets the account creation timestamp.
   */
  public get createdAt(): Timestamp {
    return this._createdAt;
  }

  /**
   * Gets the user's username.
   */
  public get username(): string | undefined {
    return this._username;
  }

  /**
   * Gets the user's disability tags.
   */
  public get disabilityTags(): string[] | undefined {
    return this._disabilityTags;
  }

  // -------------------------
  // Setters
  // -------------------------

  /**
   * Sets the user ID.
   * @param userId - The new user ID.
   */
  public set userId(userId: string) {
    if (!userId) {
      throw new Error("userId cannot be empty");
    }
    this._userId = userId;
  }

  /**
   * Sets the user's email.
   * @param email - The new email address.
   */
  public set email(email: string) {
    if (!email) {
      throw new Error("email cannot be empty");
    }
    this._email = email;
  }

  /**
   * Sets the account creation timestamp.
   * @param timestamp - The new timestamp.
   */
  public set createdAt(timestamp: Timestamp) {
    this._createdAt = timestamp;
  }

  /**
   * Sets the user's username.
   * @param username - The new username.
   */
  public set username(username: string | undefined) {
    this._username = username;
  }

  /**
   * Sets the user's disability tags.
   * @param disabilityTags - The new disability tags.
   */
  public set disabilityTags(disabilityTags: string[] | undefined) {
    this._disabilityTags =
      disabilityTags && disabilityTags.length > 0 ? disabilityTags : undefined;
  }

  // -------------------------
  // Methods
  // -------------------------

  /**
   * Converts the User instance into an object compatible with Firestore.
   * @returns An object representing the user in Firestore format.
   */
  public toFirestoreFormat(): Record<string, any> {
    const data: Record<string, any> = {
      userId: this._userId,
      email: this._email,
      createdAt: this._createdAt,
    };

    if (this._username) {
      data.username = this._username;
    }

    if (this._disabilityTags) {
      data.disabilityTags = this._disabilityTags;
    }

    return data;
  }

  /**
   * Creates a User instance from Firestore data.
   * @param data - The Firestore document data.
   * @returns A new User instance.
   */
  public static fromFirestore(data: Record<string, any>): User {
    return new User({
      userId: data.userId,
      email: data.email,
      username: data.username,
      disabilityTags: data.disabilityTags,
      createdAt: data.createdAt,
    });
  }
}
