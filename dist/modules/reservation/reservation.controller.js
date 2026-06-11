"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmReservationController = exports.reserveSeatsController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const reservation_service_1 = require("./reservation.service");
exports.reserveSeatsController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { eventId, seatIds, userId } = req.body;
    const reservation = await (0, reservation_service_1.reserveSeats)(eventId, seatIds, userId);
    res.status(201).json({ reservationId: reservation.id, expiresAt: reservation.expiresAt });
});
exports.confirmReservationController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const reservationId = Array.isArray(req.params) ? req.params[0].reservationId : req.params.reservationId;
    // console.log(reservationId)
    const { eventId } = req.body;
    const confirmedReservation = await (0, reservation_service_1.confirmReservation)(eventId, reservationId);
    res.status(200).json({ reservationId: confirmedReservation.id });
});
//# sourceMappingURL=reservation.controller.js.map