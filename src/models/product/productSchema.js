import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    productId: {
      type: String,
      unique: true,
      // required: true,
    },
    name: {
      type: String,
      // required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    category: {
      type: String,
      // required: true,
    },
    sizes: {
      S: { type: Number, default: 0 },
      M: { type: Number, default: 0 },
      L: { type: Number, default: 0 },
      XL: { type: Number, default: 0 },
      XXL: { type: Number, default: 0 },
      XXXL: { type: Number, default: 0 },
    },
    colors: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      // required: true,
      default: 0,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

ProductSchema.plugin(mongoosePaginate);

const Product = mongoose.model("Product", ProductSchema);

export { Product };
