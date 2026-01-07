import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { type } from "os";

const { Schema } = mongoose;

const BannerSchema = new Schema(
  {
    url: String,
    public_id: String,
  },
  { timestamps: true }
);

BannerSchema.plugin(mongoosePaginate);

const Banner = mongoose.model("Banner", BannerSchema);

export { Banner };
