import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

/**
 * Represents a content block within an instruction step.
 */

export type InstructionContentBlock =
  | TextContentBlock
  | ImageContentBlock
  | MediaContentBlock;

interface BaseContentBlock {
  id: string;
  type: string;
  addedBy: string;
  applicableDisabilities: string[];
}

interface TextContentBlock extends BaseContentBlock {
  type: "text";
  content: string;
}

interface ImageContentBlock extends BaseContentBlock {
  type: "image";
  url: string;
  altText: string;
}

interface MediaContentBlock extends BaseContentBlock {
  type: "video" | "audio" | "link";
  url: string;
  description?: string;
}
/**
 * Represents a step in the activity instructions.
 */
export interface InstructionStep {
  id: string;
  stepNumber: number;
  contentBlocks: InstructionContentBlock[];
}

/**
 * The instructions consist of an array of instruction steps.
 */
export type Instructions = InstructionStep[];

/**
 * Represents an activity in the application.
 */
export default class Activity {
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
    activityId = "",
    title,
    description,
    tags = [],
    instructions = [],
    createdBy,
    coverImageUrl,
    coverImageAltText,
    timestamp = Timestamp.now(),
    commentCount = 0,
  }: {
    activityId?: string;
    title: string;
    description: string;
    tags?: string[];
    instructions?: Instructions;
    createdBy: string;
    coverImageUrl?: string;
    coverImageAltText?: string;
    timestamp?: Timestamp;
    commentCount?: number;
  }) {
    // Validate required fields
    if (!title) throw new Error("title is required");
    if (!description) throw new Error("description is required");
    if (!createdBy) throw new Error("createdBy is required");

    if (coverImageUrl && !coverImageAltText) {
      throw new Error(
        "coverImageAltText is required when coverImageUrl is provided"
      );
    }

    this.activityId = activityId;
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.createdBy = createdBy;
    this.coverImageUrl = coverImageUrl;
    this.coverImageAltText = coverImageAltText;
    this.timestamp = timestamp;
    this.commentCount = commentCount;

    // Initialize instructions with IDs
    this.instructions = instructions.map((step) => ({
      ...step,
      id: step.id || uuidv4(),
      contentBlocks: step.contentBlocks.map((block) => ({
        ...block,
        id: block.id || uuidv4(),
      })),
    }));
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

  public getInstructionsForDisability(
    ...disabilityTypes: string[]
  ): InstructionStep[] {
    return this.instructions.map((step) => ({
      ...step,
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

  public setTags(tags: string[]): void {
    this.tags = tags;
  }

  public setInstructions(instructions: Instructions): void {
    // Initialize instructions with IDs
    this.instructions = instructions.map((step) => ({
      ...step,
      id: step.id || uuidv4(),
      contentBlocks: step.contentBlocks.map((block) => ({
        ...block,
        id: block.id || uuidv4(),
      })),
    }));
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

  public incrementCommentCount(): void {
    this.commentCount += 1;
  }

  /**
   * Adds content blocks to a specified step.
   * If the step exists, it appends the content blocks to it.
   * If the step doesn't exist, it creates the step with the provided content blocks.
   */
  public addContentBlocksToStep(
    stepNumber: number,
    contentBlocks: InstructionContentBlock | InstructionContentBlock[]
  ): void {
    if (!stepNumber || stepNumber <= 0) {
      throw new Error("Invalid step number");
    }

    const blocks = Array.isArray(contentBlocks)
      ? contentBlocks
      : [contentBlocks];

    blocks.forEach((block) => {
      if (!block.id) {
        block.id = uuidv4();
      }
    });

    let step = this.instructions.find((s) => s.stepNumber === stepNumber);

    if (step) {
      step.contentBlocks.push(...blocks);
    } else {
      this.instructions.push({
        id: uuidv4(),
        stepNumber: stepNumber,
        contentBlocks: blocks,
      });

      this.instructions.sort((a, b) => a.stepNumber - b.stepNumber);
    }
  }

  /**
   * Converts the Activity instance into an object compatible with Firestore.
   */
  public toFirestoreFormat(): any {
    return {
      activityId: this.activityId || null,
      title: this.title,
      description: this.description,
      tags: this.tags,
      instructions: this.instructions.map((step) => ({
        id: step.id,
        stepNumber: step.stepNumber,
        contentBlocks: step.contentBlocks.map((block) => {
          const baseBlock = {
            id: block.id,
            type: block.type,
            addedBy: block.addedBy,
            applicableDisabilities: block.applicableDisabilities,
          };

          if (block.type === "text") {
            return {
              ...baseBlock,
              content: block.content,
            };
          } else if (block.type === "image") {
            return {
              ...baseBlock,
              url: block.url,
              altText: block.altText,
            };
          } else if (
            block.type === "video" ||
            block.type === "audio" ||
            block.type === "link"
          ) {
            return {
              ...baseBlock,
              url: block.url,
              description: block.description || null,
            };
          } else {
            // In case of an unexpected block type
            return baseBlock;
          }
        }),
      })),
      createdBy: this.createdBy,
      coverImageUrl: this.coverImageUrl || null,
      coverImageAltText: this.coverImageAltText || null,
      timestamp: this.timestamp,
      commentCount: this.commentCount,
    };
  }
}
