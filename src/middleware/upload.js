import multer from 'multer';
const storage = multer.memoryStorage(); // store in memory to upload directly to Cloudinary
const upload = multer({ storage });

export default upload;
