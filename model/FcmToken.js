import mongoose, { Schema } from "mongoose";

const fcmTokenSchema = new Schema(
  {
    userId: [{ type: Schema.Types.ObjectId, ref: "User" }],
    token: {
      type: String,
      required: false,
    },
    deviceId: {
      type: String,
      required: false,
    },
    platform: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// const FcmToken = new mongoose.model("fcm_tokens", fcmToken);
module.exports = mongoose.model('fcm_tokens', fcmTokenSchema);

