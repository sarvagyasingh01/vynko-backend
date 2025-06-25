import express from "express";
import {
  auth_jwt,
  verifyAdmin,
  verifyUser,
} from "../middleware/AuthMiddleware.js";
import {
  addProduct,
  getAllProducts,
  updateProduct,
  userStats,
} from "../controllers/PrivateControllers.js";
import upload from "../middleware/upload.js";

const router = new express.Router();

const middleware = [auth_jwt, verifyAdmin];

router.use(middleware);

/**
 * @swagger
 * /private/add-product:
 *   post:
 *     summary: Add a new product (Admin only)
 *     tags: [Private]
 *     security:
 *       - XAuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sample Product"
 *               price:
 *                 type: number
 *                 example: 199.99
 *               description:
 *                 type: string
 *                 example: "Product description here"
 *               sizes:
 *                 type: object
 *                 properties:
 *                   S:
 *                     type: number 
 *                     default: 0 
 *                     example: 2
 *                   M:
 *                     type: number 
 *                     default: 0 
 *                     example: 5
 *                   L:
 *                     type: number 
 *                     default: 0 
 *                     example: 10
 *                   XL:
 *                     type: number 
 *                     default: 0 
 *                     example: 3
 *                   XXL:
 *                     type: number 
 *                     default: 0 
 *                     example: 5
 *                   XXXL:
 *                     type: number 
 *                     default: 0 
 *                     example: 6
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["red", "blue", "green"]
 *               stock:
 *                 type: number
 *                 default: 0
 *                 example: 10
 *             required:
 *               - name
 *               - price
 *               - description
 *               - stock
 *     responses:
 *       201:
 *         description: Product added successfully
 *       400:
 *         description: Required parameter missing
 *       401:
 *         description: Unauthorized - Invalid or missing X-Auth-Token
 */
router.post("/add-product", upload.array('images', 5), addProduct);

/**
 * @swagger
 * /private/update-product:
 *   post:
 *     summary: Update a product (Admin only)
 *     tags: [Private]
 *     security:
 *       - XAuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 *                 exmaple: "prod1001"
 *               name:
 *                 type: string
 *                 example: "Sample Product"
 *               price:
 *                 type: number
 *                 example: 199.99
 *               description:
 *                 type: string
 *                 example: "Product description here"
 *               sizes:
 *                 type: object
 *                 properties:
 *                   S:
 *                     type: number 
 *                     default: 0 
 *                     example: 2
 *                   M:
 *                     type: number 
 *                     default: 0 
 *                     example: 5
 *                   L:
 *                     type: number 
 *                     default: 0 
 *                     example: 10
 *                   XL:
 *                     type: number 
 *                     default: 0 
 *                     example: 3
 *                   XXL:
 *                     type: number 
 *                     default: 0 
 *                     example: 5
 *                   XXXL:
 *                     type: number 
 *                     default: 0 
 *                     example: 6
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["red", "blue", "green"]
 *               stock:
 *                 type: number
 *                 default: 0
 *                 example: 10
 *             required:
 *               - name
 *               - price
 *               - description
 *               - stock
 *     responses:
 *       201:
 *         description: Product updated successfully
 *       400:
 *         description: Required parameter missing
 *       401:
 *         description: Unauthorized - Invalid or missing X-Auth-Token
 */
router.post("/update-product", updateProduct);

/**
 * @swagger
 * /private/get-products:
 *   get:
 *     summary: Get all products
 *     tags: [Private]
 *     security:
 *       - XAuthToken: []
 *     responses:
 *       200:
 *         description: A list of all products
 *       401:
 *         description: Unauthorized - Invalid or missing X-Auth-Token
 *       500:
 *         description: Internal server error
 */
router.get("/get-products", getAllProducts);

/**
 * @swagger
 * /private/get-user-stats:
 *   get:
 *     summary: Get user stats
 *     tags: [Private]
 *     security:
 *       - XAuthToken: []
 *     responses:
 *       200:
 *         description: Stats of all the users
 *       401:
 *         description: Unauthorized - Invalid or missing X-Auth-Token
 */
router.get("/get-user-stats", userStats);

export { router };
