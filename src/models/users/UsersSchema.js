import mongoose from "mongoose";
import mongoosePlugin from "mongoose-paginate-v2";
import { getIstTime } from "../../config/getTime.js";

const schema = new mongoose.Schema(
  {
    // username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    mobile: { type: String },
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    dob: String,
    gender: String,
    join_date: { type: Number, default: new Date(getIstTime().date).getTime() },
    date: { type: String, default: new Date(getIstTime().date).toDateString() },
    join_time: { type: String, default: getIstTime().time },
    first_name: { type: String },
    last_name: String,
    address: String,
    pincode: Number,
    city: String,
    state: String,
    country: String,
    activation_date: String, // Not Necessary
    activation_status: { type: Boolean, default: false },
    activation_date: String,
    user_status: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    id_status: String, // Not Necessary //remove
    version: String, // Not Necessary //remove
    reset_password_token: String, // Not Necessary
    id_status: String, // Not Necessary
    // version: String, // Not Necessary
    profile_pic: String,

    isMobileVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isClaim: { type: Boolean, default: false },
    isTester: { type: Boolean, default: false },
    registerVia: { type: String },
    point: Number,
    profile_image_status: { type: Boolean, default: false },
    firebaseMsgToken: String,

    isMobileHidden: {
      type: Boolean,
      default: true,
    },
    isEmailHidden: {
      type: Boolean,
      default: true,
    },
    isWhatsAppHidden: {
      type: Boolean,
      default: true,
    },
    buyReferral: {
      type: Boolean,
      default: false,
    },

    mailTemplates: [
      {
        date: {
          type: Date,
        },
        templateId: {
          type: String,
        },
      },
    ],
  },

  { timestamps: true }
);
schema.plugin(mongoosePlugin);

schema.index(
  { email: 1 }, // Field to index
  {
    unique: true, // Make it unique
    partialFilterExpression: { email: { $exists: true, $ne: null } }, // Apply the filter
  }
);
const Users = new mongoose.model("users", schema);

export { Users };
