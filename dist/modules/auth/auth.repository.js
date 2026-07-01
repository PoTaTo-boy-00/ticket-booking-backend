"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.findSessionByRefreshToken = exports.rotateToken = exports.endSession = exports.createSession = exports.findOrCreateUser = exports.verifyGoogleToken = void 0;
const auth_config_1 = __importDefault(require("../../config/auth.config"));
const prisma_1 = require("../../config/prisma");
const crypto_1 = __importDefault(require("crypto"));
const verifyGoogleToken = async (tolen) => {
    const ticket = await auth_config_1.default.verifyIdToken({
        idToken: tolen,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const ticketPayload = ticket.getPayload();
    if (!ticketPayload) {
        throw new Error("Invalid token");
    }
    return {
        googleId: ticketPayload.sub,
        email: ticketPayload.email,
        name: ticketPayload.name,
        picture: ticketPayload.picture,
        emailVerified: ticketPayload.email_verified,
    };
};
exports.verifyGoogleToken = verifyGoogleToken;
const findOrCreateUser = async (payload) => {
    if (!payload.email) {
        throw new Error("Email is required");
    }
    if (!payload.name) {
        throw new Error("Name is required");
    }
    if (!payload.emailVerified) {
        throw new Error("Email is not verified");
    }
    const user = await prisma_1.prisma.user.upsert({
        where: {
            email: payload.email,
        },
        update: {},
        create: {
            email: payload.email,
            name: payload.name,
        },
    });
    return user;
};
exports.findOrCreateUser = findOrCreateUser;
const createSession = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }
    const sessionToken = crypto_1.default.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma_1.prisma.session.create({
        data: {
            refreshToken: sessionToken,
            userId: userId,
            expiresAt: expiresAt,
        },
    });
    return {
        refreshToken: sessionToken,
        expiresAt: expiresAt,
    };
};
exports.createSession = createSession;
const endSession = async (token) => {
    if (!token) {
        throw new Error("Token is required");
    }
    await prisma_1.prisma.session.delete({
        where: {
            refreshToken: token,
        },
    });
};
exports.endSession = endSession;
const rotateToken = async (oldToken) => {
    if (!oldToken) {
        throw new Error("Old token is required");
    }
    return prisma_1.prisma.$transaction(async (tx) => {
        const session = await tx.session.findUnique({
            where: {
                refreshToken: oldToken,
            },
        });
        if (!session) {
            throw new Error("Session not found");
        }
        if (session.expiresAt < new Date()) {
            await tx.session.delete({
                where: {
                    refreshToken: oldToken,
                },
            });
            throw new Error("Session expired");
        }
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const newToken = crypto_1.default.randomUUID();
        await tx.session.update({
            where: {
                refreshToken: oldToken,
            },
            data: {
                refreshToken: newToken,
                expiresAt: expiresAt,
            },
        });
        return {
            refreshToken: newToken,
            expiresAt,
            userId: session.userId,
        };
    });
};
exports.rotateToken = rotateToken;
const findSessionByRefreshToken = async (token) => {
    if (!token) {
        throw new Error("Token is required");
    }
    const session = await prisma_1.prisma.session.findUnique({
        where: {
            refreshToken: token,
        },
    });
    if (!session) {
        throw new Error("Session not found");
    }
    if (session.expiresAt < new Date()) {
        await prisma_1.prisma.session.delete({
            where: {
                refreshToken: token,
            },
        });
        throw new Error("Session expired");
    }
    return session;
};
exports.findSessionByRefreshToken = findSessionByRefreshToken;
const getUserById = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    return user;
};
exports.getUserById = getUserById;
//# sourceMappingURL=auth.repository.js.map