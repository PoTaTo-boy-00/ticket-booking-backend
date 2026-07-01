import { Router } from "express";
import { loginWithGoogleController, logoutController, meController, refreshTokenController } from "./auth.controller";
import authMiddleware from "./auth.middleware";

const router=Router();

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Login with Google
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 example: "your-google-id-token"
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Invalid Google ID token
 *       500:
 *         description: Internal server error
 */
router.post("/google", loginWithGoogleController);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh the access token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh", refreshTokenController);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the current user
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", logoutController);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the currently authenticated user
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user retrieved successfully
 *       401:
 *         description: Unauthorized
 * 
 */
router.get("/me", authMiddleware, meController);

export default router;