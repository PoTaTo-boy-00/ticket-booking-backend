import client from "../../config/auth.config";
import { prisma } from "../../config/prisma";
import crypto from "crypto";

const verifyGoogleToken = async (tolen: string) => {
  const ticket = await client.verifyIdToken({
    idToken: tolen,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const ticketPayload = ticket.getPayload();
  if (!ticketPayload) {
    throw new Error("Invalid token");
  }
  return {
    googleId: ticketPayload.sub!,
    email: ticketPayload.email!,
    name: ticketPayload.name!,
    picture: ticketPayload.picture,
    emailVerified: ticketPayload.email_verified,
  };
};

const findOrCreateUser = async (payload: {
  email: string;
  name: string;
  emailVerified: boolean;
}) => {
  if (!payload.email) {
    throw new Error("Email is required");
  }
  if (!payload.name) {
    throw new Error("Name is required");
  }
  if (!payload.emailVerified) {
    throw new Error("Email is not verified");
  }
  const user = await prisma.user.upsert({
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

const createSession = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.session.create({
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

const endSession = async (token: string) => {
  if (!token) {
    throw new Error("Token is required");
  }
  await prisma.session.delete({
    where: {
      refreshToken: token,
    },
  });
};

const rotateToken = async (oldToken: string) => {
  if (!oldToken) {
    throw new Error("Old token is required");
  }

  return prisma.$transaction(async (tx) => {
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
    const newToken = crypto.randomUUID();
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

const findSessionByRefreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Token is required");
  }
  const session = await prisma.session.findUnique({
    where: {
      refreshToken: token,
    },
  });
  if (!session) {
    throw new Error("Session not found");
  }
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({
      where: {
        refreshToken: token,
      },
    });
    throw new Error("Session expired");
  }
  return session;
};

const getUserById=async (userId: string) => {
    const user=await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    return user;
}

export {
  verifyGoogleToken,
  findOrCreateUser,
  createSession,
  endSession,
  rotateToken,
  findSessionByRefreshToken,
    getUserById
};
