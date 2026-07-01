"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("./auth.service");
const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        // console.log(token)
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const payload = (0, auth_service_1.verifyAccessToken)(token);
        req.user = {
            userId: payload.userId,
        };
        next();
    }
    catch {
        throw new Error("Unauthorized");
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map