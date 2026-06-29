import { NextFunction, Request, Response } from "express";
import {
  getCurrentUser,
  loginWithGoogle,
  logout,
  refreshAccessToken,
} from "./auth.service";
import { accessCookieOptions, refreshCookieOptions } from "../../utils/cookie";
import { logger } from "../../config/logger";

const loginWithGoogleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
console.log("Controller reached");
console.log(req.body);
  const { idToken } = req.body;
  try {
    logger.debug(idToken);
    if (!idToken) {
      throw new Error("ID token is required");
    }
    const { accessToken, refreshToken, user } = await loginWithGoogle(idToken);
    logger.warn( accessToken);
    logger.warn( refreshToken);
    res.cookie("access_token", accessToken, accessCookieOptions);
    res.cookie("refresh_token", refreshToken, refreshCookieOptions);
    return res.status(200).json({
      success: true,
      data: {
        user,
        id: user.id,
      },
    });
  } catch (error) {
    return next(error);
  }
};
const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies.refresh_token;

  try {
      if (!refreshToken) {
        throw new Error("Refresh token is required");
      }
    const token = await refreshAccessToken(refreshToken);
    return res
      .cookie("access_token", token.accessToken, accessCookieOptions)
      .cookie("refresh_token", token.refreshToken, refreshCookieOptions)
      .status(200)
      .json({
        success: true,
      });
  } catch (error) {
    return next(error);
  }
};
const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies.refresh_token;

  try {
      if (!refreshToken) {
        throw new Error("Refresh token is required");
      }
    await logout(refreshToken);
    return res
      .clearCookie("access_token", accessCookieOptions)
      .clearCookie("refresh_token", refreshCookieOptions)
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    return next(error);
  }
};
const meController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user.userId;
  try {
    logger.debug(userId)
    const user = await getCurrentUser(userId);
    return res.status(200).json({
      success: true,
      data: {
        user,
        userId: user.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
  loginWithGoogleController,
  logoutController,
  meController,
  refreshTokenController,
};
