import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    mobile: { type: String },
    email: { type: String },
    lastOtp: { type: String },
  },
  { timestamps: true }
);
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

export const OTP = new mongoose.model("otp", otpSchema);
