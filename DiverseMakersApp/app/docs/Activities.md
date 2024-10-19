# Documentation for Activity Management System

Welcome to the Activity Management System! This guide will help you understand how to work with the codebase, including creating new activities, building instruction blocks, and rendering activities in the UI.

## Table of Contents

1. [Creating a New Activity](#creating-a-new-activity)
2. [Building Instruction Blocks](#building-instruction-blocks)
3. [Rendering an Activity](#rendering-an-activity)
4. [Miscellaneous Tips](#miscellaneous-tips)

---

## Creating a New Activity

To create a new `Activity`, you'll use the `Activity` class from the `models` directory.

### Example

```typescript
import Activity from "./models/Activity";

// Create a new activity instance
const activity = new Activity({
  activityId: "", // This will be set by the ActivityService when saved to Firestore
  title: "Learn Origami",
  description: "An activity to teach the basics of origami folding.",
  tags: ["art", "craft"],
  instructions: [], // We'll add instructions later
  createdBy: "user123", // The ID of the user creating the activity. This will eventually be set automatically.
  coverImageUrl: "https://example.com/origami-cover.jpg",
  coverImageAltText: "A paper crane made with origami",
});
```

### Accessing Activity Properties

You can access properties of the `Activity` instance using its getter methods.

```typescript
console.log(activity.getTitle()); // Output: Learn Origami
console.log(activity.getDescription()); // Output: An activity to teach the basics of origami folding.
console.log(activity.getTags()); // Output: ['art', 'craft']
```

### Saving the Activity to Firestore

To save the activity to Firestore, use the `ActivityService`. I haven't tested this yet. Please let me know if it breaks.

```typescript
import { ActivityService } from "./services/ActivityService";

// Save the activity to Firestore
await ActivityService.addActivity(activity);
```

---

## Building Instruction Blocks

Instructions for an activity are made up of steps, and each step contains content blocks like text, images, videos, etc. The `InstructionBuilder` class helps you create these content blocks easily.

When you create the builder class, you will have to provide the User ID of the person adding the changes as well as what disability tags the information is relevant for. For the example below, I've used 'all', which as you can probably guess, means that the info is relevant for everyone.

### Example

```typescript
import InstructionBuilder from "./utils/InstructionBuilder";

// Create a new InstructionBuilder instance
const instructionBuilder = new InstructionBuilder("user123", ["all"]);

// Add content blocks to the builder
instructionBuilder
  .addText("Fold the paper diagonally to form a triangle.")
  .addImage("https://example.com/step1.jpg", "Folding the paper diagonally") // Second parameter is alt-text.
  .addText("Crease the fold and unfold the paper to see a diagonal line.");

// Build the content blocks
const contentBlocks = instructionBuilder.build();
```

### Adding Content Blocks to an Activity Step

Now that you have your content blocks, you can add them to a specific step in the activity.

```typescript
// Add content blocks to step 1 of the activity
activity.addContentBlocksToStep(1, contentBlocks);
```

Repeat this process for additional steps as needed.

---

## Rendering an Activity

To display the activity in the app, use the `ActivityDisplay` component.

### Example

```typescript
import React from "react";
import ActivityDisplay from "./activityDisplay";
import Activity from "./models/Activity";

// Assume 'activity' is an instance of Activity with instructions added
const App: React.FC = () => {
  return <ActivityDisplay activity={activity} />;
};

export default App;
```

This will render the activity's title, description, and instructions, including any images or media content blocks you've added.

---

## Miscellaneous Tips

### Filtering Instructions by Disability

If you want to filter the instructions based on specific disabilities (e.g., visual impairments), you can use the `getInstructionsForDisability` method.

```typescript
// Get instructions suitable for users with visual impairments
const visualInstructions = activity.getInstructionsForDisability("visual");
```

As a team, we still need to figure out how we're categorizing disabilities and stuff, so I've just been using all for everything.

### Updating an Activity

After making changes to an activity, you can update it in Firestore.

```typescript
// Make changes to the activity
activity.setTitle("Advanced Origami");

// Update the activity in Firestore
await ActivityService.updateActivity(activity);
```

### Deleting an Activity

To delete an activity from Firestore, use the `deleteActivity` method.

```typescript
// Delete the activity from Firestore
await ActivityService.deleteActivity(activity.getActivityId());
```

Tomorrow, I'll be more deeply linking users to activities since right now they're completely disconnected. I'll also be adding getters and setters for user information.