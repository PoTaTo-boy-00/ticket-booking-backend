"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservation_controller_1 = require("./reservation.controller");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const reservation_validation_1 = require("../../validations/reservation.validation");
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
reservationRouter.post("/reservations", (0, validate_middleware_1.validateBody)(reservation_validation_1.reserveSeatSchema), reservation_controller_1.reserveSeatsController);
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
reservationRouter.post("/reservations/:reservationId/confirm", (0, validate_middleware_1.validateParams)(reservation_validation_1.confirmReservationParamsSchema), (0, validate_middleware_1.validateBody)(reservation_validation_1.confirmReservationBodySchema), reservation_controller_1.confirmReservationController);
exports.default = reservationRouter;
//# sourceMappingURL=reservation.routes.js.map