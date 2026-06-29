"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenController = exports.meController = exports.logoutController = exports.loginWithGoogleController = void 0;
const auth_service_1 = require("./auth.service");
const cookie_1 = require("../../utils/cookie");
const loginWithGoogleController = async (req, res, next) => {
    const { idToken } = req.body;
    try {
        if (!idToken) {
            throw new Error("ID token is required");
        }
        const { accessToken, refreshToken, user } = await (0, auth_service_1.loginWithGoogle)(idToken);
        res.cookie("access_token", accessToken, cookie_1.accessCookieOptions);
        res.cookie("refresh_token", refreshToken, cookie_1.refreshCookieOptions);
        return res.status(200).json({
            success: true,
            data: {
                user,
            },
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.loginWithGoogleController = loginWithGoogleController;
const refreshTokenController = async (req, res, next) => {
    const refreshToken = req.cookies.refresh_token;
    try {
        if (!refreshToken) {
            throw new Error("Refresh token is required");
        }
        const token = await (0, auth_service_1.refreshAccessToken)(refreshToken);
        return res
            .cookie("access_token", token.accessToken, cookie_1.accessCookieOptions)
            .cookie("refresh_token", token.refreshToken, cookie_1.refreshCookieOptions)
            .status(200)
            .json({
            success: true,
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.refreshTokenController = refreshTokenController;
const logoutController = async (req, res, next) => {
    const refreshToken = req.cookies.refresh_token;
    try {
        if (!refreshToken) {
            throw new Error("Refresh token is required");
        }
        await (0, auth_service_1.logout)(refreshToken);
        return res
            .clearCookie("access_token", cookie_1.accessCookieOptions)
            .clearCookie("refresh_token", cookie_1.refreshCookieOptions)
            .status(200)
            .json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.logoutController = logoutController;
const meController = async (req, res, next) => {
    const userId = req.user?.userId;
    try {
        const user = await (0, auth_service_1.getCurrentUser)(userId);
        return res.status(200).json({
            success: true,
            data: {
                user,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.meController = meController;
//# sourceMappingURL=auth.controller.js.map