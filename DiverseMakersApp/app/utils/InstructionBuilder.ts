import { v4 as uuidv4 } from "uuid";
import {
  InstructionContentBlock,
  TextContentBlock,
  ImageContentBlock,
  MediaContentBlock,
} from "../models/Activity";

/**
 * A builder class for creating and managing instruction content blocks.
 */
class InstructionBuilder {
  private addedBy: string;
  private applicableDisabilities: string[];
  private contentBlocks: InstructionContentBlock[] = [];

  /**
   * Creates a new InstructionBuilder.
   * @param addedBy The user ID of the contributor.
   * @param applicableDisabilities The disability groups this content block applies to.
   */
  constructor(addedBy: string, applicableDisabilities: string[]) {
    if (!addedBy || addedBy.trim() === "") {
      throw new Error("Parameter 'addedBy' (contributor ID) is required.");
    }
    if (
      !applicableDisabilities ||
      !Array.isArray(applicableDisabilities) ||
      applicableDisabilities.length === 0
    ) {
      throw new Error("Parameter 'applicableDisabilities' is required.");
    }
    this.addedBy = addedBy;
    this.applicableDisabilities = applicableDisabilities;
  }

  /**
   * Adds a text content block with the specified content.
   * @param content The text content.
   * @returns The unique ID of the created content block.
   */
  public addText(content: string): string {
    if (!content || content.trim() === "") {
      throw new Error("Content is required for text blocks.");
    }
    const contentBlock: TextContentBlock = {
      id: uuidv4(),
      type: "text",
      content: content.trim(),
      addedBy: this.addedBy,
      applicableDisabilities: this.applicableDisabilities,
    };
    this.contentBlocks.push(contentBlock);
    return contentBlock.id;
  }

  /**
   * Adds an image content block with the specified URL and alt-text.
   * @param url The URL of the image.
   * @param altText The alt-text for the image.
   * @returns The unique ID of the created content block.
   */
  public addImage(url: string, altText: string): string {
    if (!url || url.trim() === "") {
      throw new Error("URL is required for image blocks.");
    }
    if (!altText || altText.trim() === "") {
      throw new Error("Alt-text is required for image blocks.");
    }

    const contentBlock: ImageContentBlock = {
      id: uuidv4(),
      type: "image",
      url: url.trim(),
      altText: altText.trim(),
      addedBy: this.addedBy,
      applicableDisabilities: this.applicableDisabilities,
    };
    this.contentBlocks.push(contentBlock);
    return contentBlock.id;
  }

  /**
   * Adds a media content block (video, audio, or link).
   * @param type The type of media ('video', 'audio', or 'link').
   * @param url The URL of the media.
   * @param description An optional description of the media.
   * @returns The unique ID of the created content block.
   */
  public addMedia(
    type: "video" | "audio" | "link",
    url: string,
    description?: string
  ): string {
    if (!url || url.trim() === "") {
      throw new Error(`URL is required for ${type} blocks.`);
    }

    const contentBlock: MediaContentBlock = {
      id: uuidv4(),
      type: type,
      url: url.trim(),
      description: description ? description.trim() : undefined,
      addedBy: this.addedBy,
      applicableDisabilities: this.applicableDisabilities,
    };
    this.contentBlocks.push(contentBlock);
    return contentBlock.id;
  }

  /**
   * Edits an existing content block by its ID.
   * @param id The ID of the content block to edit.
   * @param updatedFields An object containing the fields to update.
   */
  public editContentBlock(
    id: string,
    updatedFields: Partial<
      Omit<
        InstructionContentBlock,
        "id" | "type" | "addedBy" | "applicableDisabilities"
      >
    >
  ): void {
    const index = this.contentBlocks.findIndex((block) => block.id === id);
    if (index === -1) {
      throw new Error(`Content block with ID ${id} not found.`);
    }

    const block = this.contentBlocks[index];

    // Depending on the block type, merge updatedFields and validate
    switch (block.type) {
      case "text": {
        const updatedBlock: TextContentBlock = {
          ...block,
          ...updatedFields,
        } as TextContentBlock;

        if (!updatedBlock.content || updatedBlock.content.trim() === "") {
          throw new Error("Content is required for text blocks.");
        }

        this.contentBlocks[index] = updatedBlock;
        break;
      }
      case "image": {
        const updatedBlock: ImageContentBlock = {
          ...block,
          ...updatedFields,
        } as ImageContentBlock;

        if (!updatedBlock.url || updatedBlock.url.trim() === "") {
          throw new Error("URL is required for image blocks.");
        }
        if (!updatedBlock.altText || updatedBlock.altText.trim() === "") {
          throw new Error("Alt-text is required for image blocks.");
        }

        this.contentBlocks[index] = updatedBlock;
        break;
      }
      case "video":
      case "audio":
      case "link": {
        const updatedBlock: MediaContentBlock = {
          ...block,
          ...updatedFields,
        } as MediaContentBlock;

        if (!updatedBlock.url || updatedBlock.url.trim() === "") {
          throw new Error(`URL is required for ${block.type} blocks.`);
        }

        this.contentBlocks[index] = updatedBlock;
        break;
      }
      default:
        // This should never happen because all possible types are handled.
        throw new Error(`Unsupported content block type`);
    }
  }

  /**
   * Removes a content block by its ID.
   * @param id The ID of the content block to remove.
   */
  public removeContentBlock(id: string): void {
    const index = this.contentBlocks.findIndex((block) => block.id === id);
    if (index === -1) {
      throw new Error(`Content block with ID ${id} not found.`);
    }
    this.contentBlocks.splice(index, 1);
  }

  /**
   * Retrieves a content block by its ID.
   * @param id The ID of the content block to retrieve.
   * @returns The content block object.
   */
  public getContentBlock(id: string): InstructionContentBlock {
    const block = this.contentBlocks.find((block) => block.id === id);
    if (!block) {
      throw new Error(`Content block with ID ${id} not found.`);
    }
    return block;
  }

  /**
   * Returns all content blocks.
   */
  public getAllContentBlocks(): InstructionContentBlock[] {
    return [...this.contentBlocks];
  }

  /**
   * Returns the array of InstructionContentBlocks built so far.
   */
  public build(): InstructionContentBlock[] {
    // Optionally, you can remove the error if you allow building empty arrays
    if (this.contentBlocks.length === 0) {
      throw new Error("No content blocks have been added.");
    }
    return this.contentBlocks;
  }

  /**
   * Resets the builder by clearing all added content blocks.
   */
  public reset(): this {
    this.contentBlocks = [];
    return this;
  }
}

export default InstructionBuilder;
