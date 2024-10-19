import { InstructionContentBlock } from "../models/Activity";

/**
 * A builder class for creating instruction content blocks.
 * Allows developers to easily construct multiple content blocks with the required fields.
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
    if (!addedBy) throw new Error("addedBy (contributor ID) is required");
    if (!applicableDisabilities || applicableDisabilities.length === 0) {
      throw new Error("applicableDisabilities is required");
    }
    this.addedBy = addedBy;
    this.applicableDisabilities = applicableDisabilities;
  }

  /**
   * Adds a text content block with the specified content.
   * @param content The text content.
   */
  public addText(content: string): this {
    if (!content) throw new Error("Content is required for text blocks");
    const contentBlock: InstructionContentBlock = {
      type: "text",
      content,
      addedBy: this.addedBy,
      applicableDisabilities: this.applicableDisabilities,
    };
    this.contentBlocks.push(contentBlock);
    return this;
  }

  /**
   * Adds an image content block with the specified URL and alt-text.
   * @param url The URL of the image.
   * @param altText The alt-text for the image.
   */
  public addImage(url: string, altText: string): this {
    if (!url) throw new Error("URL is required for image blocks");
    if (!altText) throw new Error("Alt-text is required for image blocks");

    const contentBlock: InstructionContentBlock = {
      type: "image",
      url,
      altText,
      addedBy: this.addedBy,
      applicableDisabilities: this.applicableDisabilities,
    };
    this.contentBlocks.push(contentBlock);
    return this;
  }

  /**
   * Adds a media content block (video, audio, or link).
   * @param type The type of media ('video', 'audio', or 'link').
   * @param url The URL of the media.
   * @param description An optional description of the media.
   */
  public addMedia(
    type: "video" | "audio" | "link",
    url: string,
    description?: string
  ): this {
    if (!url) throw new Error(`URL is required for ${type} blocks`);

    const contentBlock: InstructionContentBlock = {
      type,
      url,
      description,
      addedBy: this.addedBy,
      applicableDisabilities: this.applicableDisabilities,
    };
    this.contentBlocks.push(contentBlock);
    return this;
  }

  /**
   * Builds and returns the array of InstructionContentBlocks.
   */
  public build(): InstructionContentBlock[] {
    if (this.contentBlocks.length === 0) {
      throw new Error("No content blocks have been added");
    }
    return this.contentBlocks;
  }
}

export default InstructionBuilder;
