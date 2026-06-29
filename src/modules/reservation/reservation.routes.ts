import { Router } from "express";
import { confirmReservationController, reserveSeatsController } from "./reservation.controller";
import { validateBody, validateParams } from "../../middleware/validate.middleware";
import { confirmReservationBodySchema, confirmReservationParamsSchema, reserveSeatSchema } from "../../validation/booking.validation";
import { logger } from "../../config/logger";
import authMiddleware from "../auth/auth.middleware";

const reservationRouter = Router();
/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create reservation
 *     tags:
 *       - Reservations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - userId
 *               - seatIds
 *             properties:
 *               eventId:
 *                 type: string
 *               userId:
 *                 type: string
 *               seatIds:
 *                 type: array
 *                 items:
 *                   type: string
 *           example:
 *             eventId: dec542cd-1afa-42b1-a143-f6fd8cfb4352
 *             userId: befd8037-ce85-486e-bae0-817320e0cae5
 *             seatIds:
 *               - 87e2c4d9-8fa7-443e-befb-78fc2cce858b
 *     responses:
 *       201:
 *         description: Reservation created
 */
reservationRouter.post(
  "/reservations",
  authMiddleware,
  validateBody(reserveSeatSchema),
  reserveSeatsController
);

/**
 * @swagger
 * /reservations/{reservationId}/confirm:
 *   post:
 *     summary: Confirm reservation
 *     tags:
 *       - Reservations
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation confirmed
 */
reservationRouter.post(
  "/reservations/:reservationId/confirm",
  authMiddleware,
  validateParams(confirmReservationParamsSchema),
  validateBody(confirmReservationBodySchema),
  confirmReservationController
)

export default reservationRouter;