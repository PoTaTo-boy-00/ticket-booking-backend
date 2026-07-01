"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = __importDefault(require("./auth.middleware"));
const router = (0, express_1.Router)();
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
router.post("/google", auth_controller_1.loginWithGoogleController);
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
router.post("/refresh", auth_controller_1.refreshTokenController);
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
router.post("/logout", auth_controller_1.logoutController);
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
router.get("/me", auth_middleware_1.default, auth_controller_1.meController);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map