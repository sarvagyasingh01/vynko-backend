import Cart from "../models/cart/cartSchema.js";
import { Product } from "../models/product/productSchema.js";

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

export { createCart, updateCart };
