import express from "express";
import {
  auth_jwt,
  verifyAdmin,
  verifyUser,
} from "../middleware/AuthMiddleware.js";
import { BlockUserMiddleware } from "../middleware/BlockedUserMiddleware.js";
import { createCart, createReview, updateCart } from "../controllers/SecureControllers.js";

const router = new express.Router();

const middleware = [auth_jwt, verifyUser,BlockUserMiddleware];
router.use(middleware);

/**
 * @swagger
 * /secure/create-review:
 *   post:
 *     summary: Add a new review
 *     tags: [Secure]
 *     security:
 *       - XAuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Enter the review"
 *             required:
 *               - productId
 *               - rating
 *     responses:
 *       201:
 *         description: Product added successfully
 *       400:
 *         description: Required parameter missing
 *       401:
 *         description: Unauthorized - Invalid or missing X-Auth-Token
 */
router.post("/create-review", createReview)
router.post("/create-cart", createCart)
router.post("/update-cart", updateCart)

export { router };
