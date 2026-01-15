import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

const BannerSchema = new Schema(
  {
    bannerId: {
      type: String,
      required: true,
      unique: true,
    },
    headerActive: {
      type: Boolean,
      required: true,
      default: false,
    },

    headerText: {
      type: String,
      trim: true,
    },

    desktopImage: [{
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    }],

    mobileImage: [{
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    }],
  },
  { timestamps: true }
);

BannerSchema.plugin(mongoosePaginate);

const Banner = mongoose.model("Banner", BannerSchema);

export { Banner };
