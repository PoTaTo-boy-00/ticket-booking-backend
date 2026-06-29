"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = __importDefault(require("./auth.middleware"));
const router = (0, express_1.Router)();
router.post("/google", auth_controller_1.loginWithGoogleController);
router.post("/refresh", auth_controller_1.refreshTokenController);
router.post("/logout", auth_controller_1.logoutController);
router.get("/me", auth_middleware_1.default, auth_controller_1.meController);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map