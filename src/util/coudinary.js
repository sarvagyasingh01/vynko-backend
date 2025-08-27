import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
});


// import cloudinary from '../config/cloudinary';

// export const uploadProductImages = async (filePath) => {
//   console.log(filePath)
//   try {
//     const result = await cloudinary.uploader.upload(filePath, {
//       folder: "product_images",
//     });
//     return result;
//   } catch (error) {
//     console.log(error)
//     throw new Error("Image upload failed");
//   }
// };
export const uploadProductImage = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    try {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "product_images" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      Readable.from(fileBuffer).pipe(stream);
    } catch (err) {
      reject(err);
    }
  });
};

export const deleteProductImage = async (public_id) => {
  return cloudinary.uploader.destroy(public_id);
};
