import jwt from "jsonwebtoken";
export interface AccessTokenPayload {
  userId: string;
}

const generateAccessToken = (userId: string) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET!,
        {
            expiresIn: "15m",
        }
    );
};
const verifyJWT = (accessToken: string): AccessTokenPayload => {
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as AccessTokenPayload;
        return decoded;
    }
    catch (error) {
        throw new Error("Invalid access token");
    }
};

export { generateAccessToken, verifyJWT };