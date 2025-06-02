import { Product } from "../models/product/productSchema.js";

const GenerateProductId = async () => {
    const latestProduct = await Product.findOne({ productId: { $regex: /^prod\d+$/ } })
      .sort({ createdAt: -1 });
  
    if (!latestProduct || !latestProduct.productId || !latestProduct.productId.startsWith("prod")) {
      return -1; 
    }
  
    const currentId = latestProduct.productId.replace("prod", "");
    const parsed = parseInt(currentId);
  
    if (isNaN(parsed)) {
      return -1; 
    }
  
    const idNumber = parsed + 1;
    return `prod${idNumber.toString().padStart(4, "0")}`;
  };
  
  export {GenerateProductId};
  