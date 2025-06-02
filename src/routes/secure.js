import express from "express";
import {
  auth_jwt,
  verifyAdmin,
  verifyUser,
} from "../middleware/AuthMiddleware.js";
import { BlockUserMiddleware } from "../middleware/BlockedUserMiddleware.js";
import { createCart, updateCart } from "../controllers/SecureControllers.js";

const router = new express.Router();

const middleware = [auth_jwt, verifyUser,BlockUserMiddleware];
router.use(middleware);

router.post("/create-cart", createCart)
router.post("/update-cart", updateCart)

export { router };
