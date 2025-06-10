import express from "express";
import { PublicAPI } from "../controllers/index.js";

const router = express.Router();

/**
 * @swagger
 * /send-otp:
 *   post:
 *     summary: Send OTP to a mobile number
 *     tags: [Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post("/send-otp", PublicAPI.sendOtpAPI);

/**
 * @swagger
 * /check-otp-match:
 *   post:
 *     summary: Verify the OTP entered by the user
 *     tags: [Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP matched
 */
router.post("/check-otp-match", PublicAPI.checkOtpMatchAPI);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", PublicAPI.registerAPI);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     tags: [Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", PublicAPI.loginAPI);

/**
 * @swagger
 * /validate_mobile:
 *   get:
 *     summary: Validate if a mobile number is already registered
 *     tags: [Public]
 *     parameters:
 *       - in: query
 *         name: mobile
 *         schema:
 *           type: string
 *         required: true
 *         description: Mobile number to validate
 *     responses:
 *       200:
 *         description: Mobile available
 */
router.get("/validate_mobile", PublicAPI.validateMobileAPI);

/**
 * @swagger
 * /admin-login:
 *   post:
 *     summary: Log in as an admin
 *     tags: [Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin login successful
 *       400:
 *         description: E-Mail and Password are required!
 *                  
 */
router.post("/admin-login", PublicAPI.adminLoginAPI);

/**
 * @swagger
 * /get-all-products:
 *   get:
 *     summary: Retrieve a list of all products
 *     tags: [Public]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of products per page
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Term to search for in product name or ID
 *     responses:
 *       200:
 *         description: A list of products
 *       400:
 *         description: No products found
 */
router.get("/get-all-products",PublicAPI.getAllProductsAPI)

export { router };
