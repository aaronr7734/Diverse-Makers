import { InstructionContentBlock } from "../app/models/Activity";

export interface ContentTypeOption {
  value: "text" | "image" | "video";
  label: string;
}

export interface ContentBlockInput {
  type: ContentTypeOption["value"];
  content?: string;
  url?: string;
  altText?: string;
  description?: string;
}

export interface StepContent {
  id: string;
  stepNumber: number;
  contentBlocks: InstructionContentBlock[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export type ContentBlockValidation = {
  [K in ContentTypeOption["value"]]: (
    input: ContentBlockInput
  ) => ValidationError[];
};

// Validation functions
export const validateContentBlock: ContentBlockValidation = {
  text: (input: ContentBlockInput) => {
    const errors: ValidationError[] = [];
    if (!input.content?.trim()) {
      errors.push({
        field: "content",
        message: "Text content cannot be empty",
      });
    }
    return errors;
  },

  image: (input: ContentBlockInput) => {
    const errors: ValidationError[] = [];
    if (!input.url?.trim()) {
      errors.push({
        field: "url",
        message: "Image URL cannot be empty",
      });
    }
    if (!input.altText?.trim()) {
      errors.push({
        field: "altText",
        message: "Alt text cannot be empty",
      });
    }
    return errors;
  },

  video: (input: ContentBlockInput) => {
    const errors: ValidationError[] = [];
    if (!input.url?.trim()) {
      errors.push({
        field: "url",
        message: "Video URL cannot be empty",
      });
    }
    if (!input.description?.trim()) {
      errors.push({
        field: "description",
        message: "Video description cannot be empty",
      });
    }
    return errors;
  },
};

export const CONTENT_TYPE_OPTIONS: ContentTypeOption[] = [
  { value: "text", label: "Text" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
];

// Helper functions
export const getContentPreview = (block: InstructionContentBlock): string => {
  switch (block.type) {
    case "text":
      return block.content.length > 50
        ? `${block.content.substring(0, 50)}...`
        : block.content;
    case "image":
      return `Image: ${block.altText}`;
    case "video":
    case "audio":
    case "link":
      return `${block.type.charAt(0).toUpperCase() + block.type.slice(1)}: ${
        block.description || "No description"
      }`;
    default:
      return "Unknown content type";
  }
};

// Constants
export const MAX_STEP_PREVIEW_LENGTH = 50;
export const DRAG_ACTIVATION_THRESHOLD = 5;
export const REORDER_ANIMATION_DURATION = 250;

// Accessibility helper functions
export const getAccessibilityLabel = (
  block: InstructionContentBlock
): string => {
  switch (block.type) {
    case "text":
      return `Text content: ${getContentPreview(block)}`;
    case "image":
      return `Image with description: ${block.altText}`;
    case "video":
      return `Video with description: ${block.description}`;
    default:
      return `${block.type} content`;
  }
};

export const getStepAccessibilityHint = (stepNumber: number): string => {
  return `Double tap to expand step ${stepNumber}. Hold and drag to reorder.`;
};
