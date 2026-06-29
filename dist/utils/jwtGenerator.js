"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
};
exports.generateAccessToken = generateAccessToken;
const verifyJWT = (accessToken) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        throw new Error("Invalid access token");
    }
};
exports.verifyJWT = verifyJWT;
//# sourceMappingURL=jwtGenerator.js.map