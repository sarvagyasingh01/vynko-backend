import express from "express"
import {
  auth_jwt,
  verifyAdmin,
  verifyUser,
} from "../middleware/AuthMiddleware.js";
// import { PrivateAPI } from "../controllers/index.js";
import { addProduct, updateProduct } from "../controllers/PrivateControllers.js";

const router = new express.Router();

const middleware = [auth_jwt, verifyAdmin]

router.use(middleware);

router.post("/add-product", addProduct)
router.post("/update-product", updateProduct)


export {router};