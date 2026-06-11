"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const ioredis_1 = require("ioredis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.connection = new ioredis_1.Redis(process.env.REDIS_URL || "redis://localhost:1010", {
    maxRetriesPerRequest: null,
});
//# sourceMappingURL=redis.js.map