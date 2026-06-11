"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmReservation = exports.expireReservation = exports.reserveSeats = void 0;
const client_1 = require("@prisma/client");
const reservation_repository_1 = require("./reservation.repository");
const prisma_1 = require("../../config/prisma");
const reservation_queue_1 = require("../../jobs/queue/reservation.queue");
const seat_events_1 = require("../../socket/seat.events");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const logger_1 = require("../../config/logger");
const EXPIRATION_TIME = 15 * 1000; // 15 minutes in milliseconds
const reserveSeats = async (eventId, seatIds, userId) => {
    const expiresAt = new Date(Date.now() + EXPIRATION_TIME);
    const seats = await (0, reservation_repository_1.findSeatsByIds)(seatIds);
    const seatExits = seats.length === seatIds.length;
    if (!seatExits) {
        throw new AppError_1.default("One or more seats do not exist", 400);
    }
    const allAvailable = seats.every(seat => seat.status === client_1.SeatStatus.AVAILABLE);
    if (!allAvailable) {
        throw new AppError_1.default("One or more seats are not available", 400);
    }
    const reservation = await prisma_1.prisma.$transaction(async (tx) => {
        for (const seat of seats) {
            const locked = await (0, reservation_repository_1.lockSeat)(tx, seat.id, seat.version, userId, expiresAt);
            if (locked === 0) {
                throw new AppError_1.default(`Seat ${seat.id} is no longer available`, 409);
            }
        }
        const reservation = await (0, reservation_repository_1.createReservation)(tx, userId, expiresAt);
        await (0, reservation_repository_1.createReservationSeats)(tx, reservation.id, seatIds);
        return reservation;
    });
    logger_1.logger.info(`Reservation ${reservation.id} added to expiration queue`);
    if (process.env.NODE_ENV !== "test") {
        for (const seat of seats) {
            (0, seat_events_1.emitSeatEvents)(eventId, seat.id, client_1.SeatStatus.HELD);
        }
    }
    await reservation_queue_1.reservationExpirationQueue.add("expire-reservation", {
        eventId,
        reservationId: reservation.id,
    }, {
        delay: EXPIRATION_TIME,
        removeOnComplete: 100,
        removeOnFail: 100,
    });
    return reservation;
};
exports.reserveSeats = reserveSeats;
const expireReservation = async (eventId, reservationId) => {
    const seats = await prisma_1.prisma.$transaction(async (tx) => {
        const updatedReservations = await (0, reservation_repository_1.updateReservationStatusExpired)(tx, reservationId, client_1.ReservationStatus.EXPIRED);
        if (updatedReservations === 0) {
            logger_1.logger.info(`Reservation ${reservationId} cannot be expired. It may have already been confirmed or expired.`);
            return;
        }
        const seats = await (0, reservation_repository_1.findSeatsByReservationId)(tx, reservationId);
        await (0, reservation_repository_1.releaseSeatsByReservation)(tx, reservationId);
        logger_1.logger.info(`Reservation ${reservationId} expired`);
        return seats;
    });
    if (!seats) {
        return;
    }
    if (process.env.NODE_ENV !== "test") {
        for (const seat of seats) {
            (0, seat_events_1.emitSeatEvents)(eventId, seat.id, client_1.SeatStatus.AVAILABLE);
        }
    }
};
exports.expireReservation = expireReservation;
const confirmReservation = async (eventId, reservationId) => {
    let seats = [];
    const booking = await prisma_1.prisma.$transaction(async (tx) => {
        const reservation = await (0, reservation_repository_1.findReservationById)(tx, reservationId);
        if (!reservation) {
            throw new AppError_1.default("Reservation not found", 404);
        }
        const updatedReservations = await (0, reservation_repository_1.updateReservationStatusBooked)(tx, reservationId, client_1.ReservationStatus.CONFIRMED);
        if (updatedReservations === 0) {
            throw new AppError_1.default("Reservation cannot be confirmed. It may have expired or already been confirmed.", 409);
        }
        const booking = await (0, reservation_repository_1.createBooking)(tx, reservation.userId, reservationId);
        await (0, reservation_repository_1.markSeatsBooked)(tx, reservationId);
        seats = await (0, reservation_repository_1.findSeatsByReservationId)(tx, reservationId);
        return booking;
    });
    if (seats.length === 0) {
        return booking;
    }
    if (process.env.NODE_ENV !== "test") {
        for (const seat of seats) {
            (0, seat_events_1.emitSeatEvents)(eventId, seat.id, client_1.SeatStatus.BOOKED);
        }
    }
    return booking;
};
exports.confirmReservation = confirmReservation;
//# sourceMappingURL=reservation.service.js.map