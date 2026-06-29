import express from "express";
import cors from "cors";
import helmet from "helmet";
import seatRouter from './modules/seats/seat.routes';
import reservationRouter from "./modules/reservation/reservation.routes";
import authRouter from "./modules/auth/auth.routes"
import { errorHandler } from "./middleware/error.middleware";
import { swaggerSpec } from "./config/swagger";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authMiddleware from "./modules/auth/auth.middleware";

dotenv.config();
const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());


app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
)

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check server health
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UP
 */
app.get("/api/health", (_, res) => {
  res.status(200).json({
    status: "UP",
  });
});

app.use("/api",seatRouter);
app.use("/api",reservationRouter);
app.use("/api/auth", authRouter);



app.use(errorHandler)

export default app;