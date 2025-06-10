import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
    },
    empty:{
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

ReviewSchema.plugin(mongoosePaginate);

const Review = mongoose.model("Review", ReviewSchema);

export { Review };
