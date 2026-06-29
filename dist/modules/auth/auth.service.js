"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.verifyAccessToken = exports.logout = exports.refreshAccessToken = exports.loginWithGoogle = void 0;
const auth_repository_1 = require("./auth.repository");
const jwtGenerator_1 = require("../../utils/jwtGenerator");
const loginWithGoogle = async (idToken) => {
    if (idToken === undefined || idToken === null || idToken === "") {
        throw new Error("ID token is required");
    }
    const ticket = await (0, auth_repository_1.verifyGoogleToken)(idToken);
    if (!ticket) {
        throw new Error("Invalid token");
    }
    const user = await (0, auth_repository_1.findOrCreateUser)({
        email: ticket.email,
        name: ticket.name,
        emailVerified: ticket.emailVerified || false,
    });
    if (!user) {
        throw new Error("User not found");
    }
    const session = await (0, auth_repository_1.createSession)(user.id);
    if (!session) {
        throw new Error("Session not created");
    }
    const accessToken = (0, jwtGenerator_1.generateAccessToken)(user.id);
    return {
        accessToken,
        refreshToken: session.refreshToken,
        user,
    };
};
exports.loginWithGoogle = loginWithGoogle;
const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new Error("Refresh token is required");
    }
    const session = await (0, auth_repository_1.rotateToken)(refreshToken);
    if (!session) {
        throw new Error("Invalid refresh token");
    }
    const accessToken = (0, jwtGenerator_1.generateAccessToken)(session.userId);
    return {
        accessToken,
        refreshToken: session.refreshToken,
    };
};
exports.refreshAccessToken = refreshAccessToken;
const logout = async (refreshToken) => {
    if (!refreshToken) {
        throw new Error("Refresh token is required");
    }
    await (0, auth_repository_1.endSession)(refreshToken);
};
exports.logout = logout;
const verifyAccessToken = (accessToken) => {
    if (!accessToken) {
        throw new Error("Access token is required");
    }
    const decoded = (0, jwtGenerator_1.verifyJWT)(accessToken);
    if (!decoded) {
        throw new Error("Invalid access token");
    }
    return decoded;
};
exports.verifyAccessToken = verifyAccessToken;
const getCurrentUser = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }
    const user = await (0, auth_repository_1.getUserById)(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=auth.service.js.map