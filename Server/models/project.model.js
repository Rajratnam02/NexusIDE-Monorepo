import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    title: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["editor", "viewer"],
          default: "viewer",
        },
      },
    ],
    files: [
      {
        name: {
          type: String,
          required: true,
        },
        content: {
          type: String,
        },
        language: {
          type: String,
        },
      },
    ],
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Project", projectSchema);
