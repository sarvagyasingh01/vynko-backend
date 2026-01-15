import { Banner } from "../models/assets/bannerSchema.js";
import Cart from "../models/cart/cartSchema.js";
import { Product } from "../models/product/productSchema.js";
import { Review } from "../models/product/reviewSchema.js";

const createCart = async (req, res) => {
  const { userId, newItems } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User Id is required" });
  }
  if (!newItems) {
    return res
      .status(400)
      .json({ success: false, message: "At least one item is required" });
  }

  try {
    const cart = await Cart.findOne({ userId: userId });

    if (cart) {
      cart.items.push(...newItems);
      cart.totalCost += newItems[0].cost ;
      await cart.save();

      return res.status(201).json({
        success: true,
        message: "Cart updated successfully",
      });
    }

    const newCart = new Cart({
      userId: userId,
      items: newItems,
      totalCost: newItems[0].cost
    });

    await newCart.save();

    return res.status(201).json({
      success: true,
      message: "Cart created successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const updateCart = async (req, res) => {
  const { userId, productId, operation, cost } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User Id is required" });
  }
  if (!productId) {
    return res
      .status(400)
      .json({ success: false, message: "Product Id is required" });
  }
  if (!operation) {
    return res
      .status(400)
      .json({ success: false, message: "Operation is required" });
  }
  if (!cost) {
    return res
      .status(400)
      .json({ success: false, message: "User Id is required" });
  }

  if (
    operation !== "increase" &&
    operation !== "decrease" &&
    operation !== "remove"
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Operation is invalid" });
  }

  try {
    const product = await Product.findOne({ productId: productId });

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product doesn't exist" });
    }

    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res
        .status(400)
        .json({ success: false, message: "Cart doesn't exist" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    const selectedSize = cart.items[itemIndex].selectedSize;

    if (operation === "increase") {
      if (product.sizes[selectedSize] > cart.items[itemIndex].quantity) {
        // Only increase if the stock for the selected size is available
        cart.items[itemIndex].quantity += 1;
        cart.totalCost += cart.items[itemIndex].cost;
      } else {
        return res
          .status(400)
          .json({ message: "Can't add more for this size!" });
      }
    }

    if (operation === "decrease") {
      if (cart.items[itemIndex].quantity > 1) {
        // Only decrease if quantity > 1, or remove if quantity would go to 0
        cart.items[itemIndex].quantity -= 1;
        cart.totalCost -= cart.items[itemIndex].cost;
      } else {
        cart.totalCost -= cart.items[itemIndex].cost;
        cart.items.splice(itemIndex, 1); // Remove the item if quantity is 1
      }
      
    }

    if (operation === "remove") {
      cart.totalCost -= cart.items[itemIndex].cost * cart.items[itemIndex].quantity;
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();

    return res.status(201).json({
      success: true,
      message: `${operation}d successfully!`,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const createReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  if (!productId) {
    return res
      .status(400)
      .json({ success: false, message: "Product Id is required" });
  }
  if (!rating) {
    return res
      .status(400)
      .json({ success: false, message: "Rating is required" });
  }
  if (rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ success: false, message: "Enter rating between 1 and 5" });
  }

  try {
    const product = await Product.findOne({ productId });

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found!" });
    }

    const exists = await Review.findOne({userId: req.auth.userId, productId})

    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User can write one review only" });
    }

    const newReview = new Review({
      userId: req.auth.userId,
      productId,
      rating,
    });

    if(comment){
      newReview.comment = comment;
      newReview.empty = false;
    }

    await newReview.save();

    const result = await Review.aggregate([
      { $match: { productId: productId } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    const averageRating = result[0]?.avgRating || 0;
    product.ratings = averageRating;
    product.numReviews += 1;
    await product.save();

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const createBanner = async () => {
  try {
    const banner = new Banner({
      bannerId: "banner0001",
      headerActive: true,
    });

    const savedBanner = await banner.save();
    return savedBanner;
  } catch (error) {
    throw error;
  }
};



export { createCart, updateCart, createReview};
