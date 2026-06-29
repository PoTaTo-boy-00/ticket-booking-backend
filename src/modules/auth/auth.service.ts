import jwt from "jsonwebtoken";
import {
  createSession,
  endSession,
  findOrCreateUser,
  findSessionByRefreshToken,
  getUserById,
  rotateToken,
  verifyGoogleToken,
} from "./auth.repository";
import { generateAccessToken, verifyJWT } from "../../utils/jwtGenerator";

const loginWithGoogle = async (idToken: string) => {
  if (idToken === undefined || idToken === null || idToken === "") {
    throw new Error("ID token is required");
  }
  const ticket = await verifyGoogleToken(idToken);
  if (!ticket) {
    throw new Error("Invalid token");
  }
  const user = await findOrCreateUser({
    email: ticket.email,
    name: ticket.name,
    emailVerified: ticket.emailVerified || false,
  });
  if (!user) {
    throw new Error("User not found");
  }
  const session = await createSession(user.id);
  if (!session) {
    throw new Error("Session not created");
  }
  const accessToken = generateAccessToken(user.id);
  return {
    accessToken,
    refreshToken: session.refreshToken,
    user,
  };
};

const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }
  const session = await rotateToken(refreshToken);
  if (!session) {
    throw new Error("Invalid refresh token");
  }
  const accessToken = generateAccessToken(session.userId);

  return {
    accessToken,
    refreshToken: session.refreshToken,
  };
};

const logout = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }
  await endSession(refreshToken);
};

const verifyAccessToken =  (accessToken: string) => {
    if (!accessToken) {
        throw new Error("Access token is required");
    }
    const decoded=verifyJWT(accessToken);
    if (!decoded) {
        throw new Error("Invalid access token");
    }
    return decoded;
  
};

const getCurrentUser = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export {
  loginWithGoogle,
  refreshAccessToken,
  logout,
  verifyAccessToken,
  getCurrentUser,
};
