import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "./auth.service";

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.access_token;
// console.log(token)
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const payload = verifyAccessToken(token);

    req.user = {
      userId: payload.userId,
    };

    next();
  } catch {
    throw new Error("Unauthorized");
  }
};

export default authMiddleware;