import { Timestamp } from "firebase/firestore";

/**
 * Represents a content block within an instruction step.
 * Each content block has a type and contains content relevant to that type.
 * It also includes the user who added it and the disabilities it applies to.
 */
export type InstructionContentBlock =
  | {
      type: "text";
      content: string;
      addedBy: string; // User ID of the contributor
      applicableDisabilities: string[]; // e.g., ['visual'], ['all']
    }
  | {
      type: "image";
      url: string;
      altText: string;
      addedBy: string;
      applicableDisabilities: string[];
    }
  | {
      type: "video" | "audio" | "link";
      url: string;
      description?: string;
      addedBy: string;
      applicableDisabilities: string[];
    };

/**
 * Represents a step in the activity instructions.
 * Each step has a step number and an array of content blocks.
 */
interface InstructionStep {
  stepNumber: number; // Position in the sequence
  contentBlocks: InstructionContentBlock[];
}

/**
 * The instructions consist of an array of instruction steps.
 */
type Instructions = InstructionStep[];

/**
 * Represents an activity in the application.
 */
export default class Activity {
  // Private properties
  private activityId: string;
  private title: string;
  private description: string;
  private tags: string[];
  private instructions: Instructions;
  private createdBy: string;
  private coverImageUrl?: string;
  private coverImageAltText?: string;
  private timestamp: Timestamp;
  private commentCount: number;

  /**
   * Creates a new Activity instance.
   */
  constructor({
    activityId,
    title,
    description,
    tags = [],
    instructions = [],
    createdBy,
    coverImageUrl,
    coverImageAltText,
  }: {
    activityId: string;
    title: string;
    description: string;
    tags?: string[];
    instructions?: Instructions;
    createdBy: string;
    coverImageUrl?: string;
    coverImageAltText?: string;
  }) {
    // Validate required fields

    if (!title) throw new Error("title is required");
    if (!description) throw new Error("description is required");
    if (!createdBy) throw new Error("createdBy is required");

    // If coverImageUrl is provided, coverImageAltText must also be provided
    if (coverImageUrl && !coverImageAltText) {
      throw new Error(
        "coverImageAltText is required when coverImageUrl is provided"
      );
    }

    this.activityId = activityId;
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.instructions = instructions;
    this.createdBy = createdBy;
    this.coverImageUrl = coverImageUrl;
    this.coverImageAltText = coverImageAltText;
    this.timestamp = Timestamp.now();
    this.commentCount = 0;
  }

  // Getter methods
  public getActivityId(): string {
    return this.activityId;
  }

  public getTitle(): string {
    return this.title;
  }

  public getDescription(): string {
    return this.description;
  }

  public getTags(): string[] {
    return this.tags;
  }

  public getInstructions(): Instructions {
    return this.instructions;
  }

  /**
   * Retrieves the instructions filtered by the specified disability type.
   */

  public getInstructionsForDisability(
    ...disabilityTypes: string[]
  ): InstructionStep[] {
    return this.instructions.map((step) => ({
      stepNumber: step.stepNumber,
      contentBlocks: step.contentBlocks.filter(
        (block) =>
          block.applicableDisabilities.includes("all") ||
          disabilityTypes.some((disabilityType) =>
            block.applicableDisabilities.includes(disabilityType)
          )
      ),
    }));
  }

  public getCreatedBy(): string {
    return this.createdBy;
  }

  public getCoverImageUrl(): string | undefined {
    return this.coverImageUrl;
  }

  public getCoverImageAltText(): string | undefined {
    return this.coverImageAltText;
  }

  public getTimestamp(): Timestamp {
    return this.timestamp;
  }

  public getFormattedTimestamp(): string {
    return this.timestamp.toDate().toLocaleString();
  }

  public getCommentCount(): number {
    return this.commentCount;
  }

  // Setter and modifier methods

  public setActivityId(activityId: string): void {
    if (!activityId) throw new Error("activityId cannot be empty");
    this.activityId = activityId;
  }

  public setTitle(title: string): void {
    if (!title) throw new Error("title cannot be empty");
    this.title = title;
  }

  public setDescription(description: string): void {
    if (!description) throw new Error("description cannot be empty");
    this.description = description;
  }

  public setCommentCount(commentCount: number): void {
    this.commentCount = commentCount;
  }

  public setTimestamp(timestamp: Timestamp): void {
    this.timestamp = timestamp;
  }

  public addTag(tag: string): void {
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  public removeTag(tag: string): void {
    this.tags = this.tags.filter((t) => t !== tag);
  }

  /**
   * Adds content blocks to a specified step.
   * If the step exists, it appends the content blocks to it.
   * If the step doesn't exist, it creates the step with the provided content blocks.
   * @param stepNumber The step number to add content blocks to.
   * @param contentBlocks One or more content blocks to add.
   */
  public addContentBlocksToStep(
    stepNumber: number,
    contentBlocks: InstructionContentBlock | InstructionContentBlock[]
  ): void {
    if (!stepNumber || stepNumber <= 0) {
      throw new Error("Invalid step number");
    }

    // Ensure contentBlocks is an array
    const blocks = Array.isArray(contentBlocks)
      ? contentBlocks
      : [contentBlocks];

    // Find the step
    let step = this.instructions.find((s) => s.stepNumber === stepNumber);

    if (step) {
      // Step exists, add contentBlocks
      step.contentBlocks.push(...blocks);
    } else {
      // Step does not exist, create it
      this.instructions.push({
        stepNumber: stepNumber,
        contentBlocks: blocks,
      });

      // Ensure the instructions are sorted by stepNumber
      this.instructions.sort((a, b) => a.stepNumber - b.stepNumber);
    }
  }

  public incrementCommentCount(): void {
    this.commentCount += 1;
  }

  /**
   * Converts the Activity instance into an object compatible with Firestore.
   */
  public toFirestoreFormat(): any {
    return {
      activityId: this.activityId,
      title: this.title,
      description: this.description,
      tags: this.tags,
      instructions: this.instructions,
      createdBy: this.createdBy,
      coverImageUrl: this.coverImageUrl || null,
      coverImageAltText: this.coverImageAltText || null,
      timestamp: this.timestamp,
      commentCount: this.commentCount,
    };
  }
}
