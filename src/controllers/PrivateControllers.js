import { GenerateProductId } from "../config/generateProductId.js";
import Cart from "../models/cart/cartSchema.js";
import { Product } from "../models/product/productSchema.js";

const addProduct = async (req, res) => {
  const { name, price, description, colors, stock, sizes } = req.body;

  const parsedSizes = {};
  let count = 0;

  if (sizes || Object.keys(sizes).length > 0) {
    ["XS", "S", "M", "L", "XL", "XXL"].forEach((size) => {
      parsedSizes[size] = parseInt(req.body.sizes?.[size] || 0, 10);
      count += parseInt(req.body.sizes?.[size] || 0, 10);
    });
  }

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Product name is required" });
  }
  if (!price) {
    return res
      .status(400)
      .json({ success: false, message: "Product price is required" });
  }
  if (!description) {
    return res
      .status(400)
      .json({ success: false, message: "Product description is required" });
  }
  if (!colors) {
    return res
      .status(400)
      .json({ success: false, message: "Colors of the product are required" });
  }

  if (!stock) {
    return res
      .status(400)
      .json({ success: false, message: "Mention the total amount of stock" });
  }
  if (stock != count) {
    return res.status(400).json({
      success: false,
      message: `The total stock is ${stock} and total quantity of all sizes is ${count}!`,
    });
  }

  try {
    const id = await GenerateProductId();

    const newProduct = new Product({
      productId: id,
      name: name,
      description: description,
      price: price,
      colors: colors,
      stock: stock,
      sizes: parsedSizes,
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: {
        product: savedProduct,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  const { id, name, price, description, colors, stock, sizes } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Product id is required" });
  }

  const parsedSizes = {};
  let count = 0;

  if (sizes || Object.keys(sizes).length > 0) {
    ["XS", "S", "M", "L", "XL", "XXL"].forEach((size) => {
      parsedSizes[size] = parseInt(req.body.sizes?.[size] || 0, 10);
      count += parseInt(req.body.sizes?.[size] || 0, 10);
    });
  }

  if (stock != count) {
    return res.status(400).json({
      success: false,
      message: `The total stock is ${stock} and total quantity of all sizes is ${count}!`,
    });
  }

  try {
    const product = await Product.findOne({ productId: id });

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found!" });
    }

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (colors !== undefined) product.colors = colors;
    if (stock !== undefined) product.stock = stock;
    if (sizes !== undefined) product.sizes = sizes;

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const searchTerm = req.query.searchTerm || "";

    const matchStage = {
      $and: [
        !!searchTerm
          ? {
              $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { productId: { $regex: searchTerm, $options: "i" } },
              ],
            }
          : {},
      ],
    };

    const countPipeline = [
      { $match: matchStage },
      { $count: "totalDocs" },
    ];

    const dataPipeline = [
      { $match: matchStage },
      { $sort: { createdAt: 1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
      {
        $project: {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ];

    const [countResult, dataResult] = await Promise.all([
      Product.aggregate(countPipeline),
      Product.aggregate(dataPipeline),
    ]);

    const totalItems = countResult.length > 0 ? countResult[0].totalDocs : 0;
    const totalPages = Math.ceil(totalItems / pageSize);
    const hasNextPage = page < totalPages;
    const nextPage = hasNextPage ? page + 1 : null;
    const hasPrevPage = page > 1;
    const prevPage = hasPrevPage ? page - 1 : null;
    const pagingCounter = (page - 1) * pageSize + 1;

    const response = {
      totalDocs: totalItems,
      limit: pageSize,
      totalPages,
      page,
      pagingCounter,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      docs: dataResult,
    };

    if (dataResult.length > 0) {
      return res.status(200).json({ data: response });
    } else {
      return res.status(400).json({ message: "No products found" });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export { addProduct, updateProduct, getAllProducts };
