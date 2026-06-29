import { Router } from "express";
import { loginWithGoogleController, logoutController, meController, refreshTokenController } from "./auth.controller";
import authMiddleware from "./auth.middleware";

const router=Router();

router.post("/google", loginWithGoogleController);

router.post("/refresh", refreshTokenController);

router.post("/logout", logoutController);

router.get("/me", authMiddleware, meController);

export default router;