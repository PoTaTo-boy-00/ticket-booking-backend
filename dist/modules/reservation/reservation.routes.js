"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservation_controller_1 = require("./reservation.controller");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const booking_validation_1 = require("../../validation/booking.validation");
const auth_middleware_1 = __importDefault(require("../auth/auth.middleware"));
const reservationRouter = (0, express_1.Router)();
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
reservationRouter.post("/reservations", auth_middleware_1.default, (0, validate_middleware_1.validateBody)(booking_validation_1.reserveSeatSchema), reservation_controller_1.reserveSeatsController);
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
reservationRouter.post("/reservations/:reservationId/confirm", auth_middleware_1.default, (0, validate_middleware_1.validateParams)(booking_validation_1.confirmReservationParamsSchema), (0, validate_middleware_1.validateBody)(booking_validation_1.confirmReservationBodySchema), reservation_controller_1.confirmReservationController);
exports.default = reservationRouter;
//# sourceMappingURL=reservation.routes.js.map