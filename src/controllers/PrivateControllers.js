import { GenerateProductId } from "../config/generateProductId.js";
import Cart from "../models/cart/cartSchema.js";
import { Users } from "../models/index.js";
import { Product } from "../models/product/productSchema.js";
import moment from "moment";
import { deleteProductImage, uploadBannerImage, uploadProductImage } from "../util/coudinary.js";
import { Banner } from "../models/assets/bannerSchema.js";

const addProduct = async (req, res) => {
  const { name, price, discountPrice, description, stock, sizes } = req.body;
  const images = req.files;

  const parsedSizes = {};
  let count = 0;

  if (sizes && Object.keys(sizes).length > 0) {
    ["S", "M", "L", "XL", "XXL", "XXXL"].forEach((size) => {
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

  // if (!stock) {
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Mention the total amount of stock" });
  // }
  // if (stock != count) {
  //   return res.status(400).json({
  //     success: false,
  //     message: `The total stock is ${stock} and total quantity of all sizes is ${count}!`,
  //   });
  // }

  try {
    const uploadedImages = [];

    for (const file of images) {
      try {
        const result = await uploadProductImage(file.buffer);
        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      } catch (error) {
        console.error(`Image upload failed for one of the files:`, error);
        return res.status(500).json({
          success: false,
          message: "One or more image uploads failed. Please try again.",
        });
      }
    }

    const id = await GenerateProductId();

    const newProduct = new Product({
      productId: id,
      name: name,
      description: description,
      price: price,
      discountPrice: discountPrice,
      stock: count,
      sizes: parsedSizes,
      images: uploadedImages,
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
  const { id, name, price, discountPrice, description, stock, sizes } =
    req.body;
  const images = req.files;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Product id is required" });
  }

  const parsedSizes = {};
  let count = 0;

  if (sizes || Object.keys(sizes).length > 0) {
    ["S", "M", "L", "XL", "XXL", "XXXL"].forEach((size) => {
      parsedSizes[size] = parseInt(req.body.sizes?.[size] || 0, 10);
      count += parseInt(req.body.sizes?.[size] || 0, 10);
    });
  }

  // if (stock != count) {
  //   return res.status(400).json({
  //     success: false,
  //     message: `The total stock is ${stock} and total quantity of all sizes is ${count}!`,
  //   });
  // }

  try {
    const product = await Product.findOne({ productId: id });

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found!" });
    }

    // const uploadedImages = [];

    // if (images) {
    //   for (const file of images) {
    //     try {
    //       const result = await uploadProductImage(file.buffer);
    //       uploadedImages.push({
    //         url: result.secure_url,
    //         public_id: result.public_id,
    //       });
    //     } catch (error) {
    //       console.error(`Image upload failed for one of the files:`, error);
    //       return res.status(500).json({
    //         success: false,
    //         message: "One or more image uploads failed. Please try again.",
    //       });
    //     }
    //   }
    // }

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (description !== undefined) product.description = description;
    if (stock !== undefined) product.stock = count;
    if (sizes !== undefined) product.sizes = parsedSizes;
    // if (images !== undefined) product.images = uploadedImages;

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

const deleteProduct = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Product id is required" });
  }

  try {
    const product = await Product.findOne({ productId: id });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }

    await Product.deleteOne({ productId: id });

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
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
    const searchId = req.query.searchId || "";

    const matchConditions = [];

    if (searchTerm) {
      matchConditions.push({
        // name: { $regex: searchTerm, $options: "i" }, This condition is used to match the term anywhere in the string
        name: { $regex: "^" + searchTerm, $options: "i" }, //This condition matches the term from the begining of the string
      });
    }

    if (searchId) {
      matchConditions.push({
        productId: searchId,
      });
    }

    const matchStage =
      matchConditions.length > 0 ? { $and: matchConditions } : {};

    const countPipeline = [{ $match: matchStage }, { $count: "totalDocs" }];

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

const userStats = async (req, res) => {
  try {
    const now = moment().endOf("day");
    const startOfToday = moment().startOf("day");
    const oneWeekAgo = moment().subtract(6, "days").startOf("day");
    const oneMonthAgo = moment().subtract(1, "months").startOf("day");

    // Total users
    const totalUsers = await Users.countDocuments();

    // Users by day for last 7 days
    const dailyStats = await Users.aggregate([
      {
        $match: {
          createdAt: { $gte: oneWeekAgo.toDate(), $lte: now.toDate() },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Fill missing days in reverse order: today, yesterday, ..., 6 days ago
    const usersLast7Days = [];
    for (let i = 0; i < 7; i++) {
      const day = moment().subtract(i, "days").format("YYYY-MM-DD");
      const stat = dailyStats.find((d) => d._id === day);
      usersLast7Days.push({ date: day, count: stat ? stat.count : 0 });
    }

    // Total users last week
    const totalLastWeek = await Users.countDocuments({
      createdAt: {
        $gte: oneWeekAgo.toDate(),
        $lte: now.toDate(),
      },
    });

    // Total users last month
    const totalLastMonth = await Users.countDocuments({
      createdAt: {
        $gte: oneMonthAgo.toDate(),
        $lte: now.toDate(),
      },
    });

    res.json({
      totalUsers,
      usersLast7Days,
      totalLastWeek,
      totalLastMonth,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const changeProductStatus = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Product id is required" });
  }

  try {
    const product = await Product.findOne({ productId: id });

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "!Product Not Found" });
    }

    product.active = !product.active;
    await product.save();

    return res
      .status(200)
      .json({ message: "Product status changed successfully" });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editProductImages = async (req, res) => {
  const { productId } = req.params;
  const images = req.files;

  if (!images || images.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No images uploaded." });
  }

  try {
    const product = await Product.findOne({ productId });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    // Delete old images from Cloudinary
    const deletePromises = product.images.map((img) =>
      deleteProductImage(img.public_id)
    );
    await Promise.all(deletePromises);

    // Upload new images to Cloudinary
    const uploadedImages = [];

    for (const file of images) {
      const result = await uploadProductImage(file.buffer);
      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    // Replace old images in the product
    product.images = uploadedImages;
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product images updated successfully.",
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("Error updating product images:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


const editHeader = async (req, res) => {
  const { headerText, headerActive } = req.body;

  try {
    const banner = await Banner.findOne({
      bannerId: "VYNKO-MAIN-BANNER",
    });

    if (!banner) {
      return res.status(400).json({
        success: false,
        message: "Banner not found!",
      });
    }

    const updateData = {};

    if (headerText !== undefined) {
      updateData.headerText = headerText;
    }

    if (headerActive !== undefined) {
      updateData.headerActive = headerActive;
    }

    const bannerUpdate = await Banner.findOneAndUpdate(
      { bannerId: "VYNKO-MAIN-BANNER" },
      { $set: updateData },
      { new: true }
    );

    return res.status(201).json({
      message: "Header updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateBannerImages = async (req, res) => {
  const { type } = req.body; // "desktop" | "mobile"
  const images = req.files;

  if (!type || !["desktop", "mobile"].includes(type)) {
    return res.status(400).json({
      success: false,
      message: "Invalid banner image type.",
    });
  }

  if (!images || images.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No images uploaded.",
    });
  }

  try {
    const banner = await Banner.findOne({
      bannerId: "VYNKO-MAIN-BANNER",
    });

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found.",
      });
    }

    // 🔥 Delete old images
    const oldImages =
      type === "desktop" ? banner.desktopImage : banner.mobileImage;

    const deletePromises = oldImages.map((img) =>
      deleteProductImage(img.public_id)
    );
    await Promise.all(deletePromises);

    // 📤 Upload new images
    const uploadedImages = [];

    for (const file of images) {
      const result = await uploadBannerImage(file.buffer);
      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    // 🧠 Replace images
    if (type === "desktop") {
      banner.desktopImage = uploadedImages;
    } else {
      banner.mobileImage = uploadedImages;
    }

    await banner.save();

    return res.status(200).json({
      success: true,
      message: `${type === "desktop" ? "Desktop" : "Mobile"
        } banner images updated successfully.`,
      data: {
        banner,
      },
    });
  } catch (error) {
    console.error("Error updating banner images:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export {
  addProduct,
  updateProduct,
  getAllProducts,
  userStats,
  changeProductStatus,
  deleteProduct,
  editProductImages,
  editHeader,
  updateBannerImages,
  
};
