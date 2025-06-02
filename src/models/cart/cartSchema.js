import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

const CartSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        selectedSize: {
          type: String,
          enum: ["XS", "S", "M", "L", "XL", "XXL"],
          required: true,
        },
        cost: {
          type: Number,
          required: true
        }
      },
    ],
    totalCost: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

CartSchema.plugin(mongoosePaginate);

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;
