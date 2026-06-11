"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
const logger_1 = require("../config/logger");
const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError_1.default) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }
    logger_1.logger.error(err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map