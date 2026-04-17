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
      required: true,
      trim: true,
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
          enum: ["co-leader", "editor", "viewer"],
          default: "viewer",
        },
        status: {
          type: String,
          enum: ["accepted", "pending"],
          default: "accepted",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
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
          default: "",
        },
        language: {
          type: String,
          default: "javascript",
        },
        updatedAt: {
          type: Date,
          default: Date.now,
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
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Project", projectSchema);
