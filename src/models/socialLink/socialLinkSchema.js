import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

const SocialLinkSchema = new Schema(
  {
    platform: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      enum: ["instagram", "whatsapp", "x", "meta"],
    },

    url: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

SocialLinkSchema.plugin(mongoosePaginate);

const SocialLink = mongoose.model("SocialLink", SocialLinkSchema);

export { SocialLink };
