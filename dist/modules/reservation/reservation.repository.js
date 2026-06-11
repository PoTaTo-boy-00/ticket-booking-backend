"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markSeatsBooked = exports.createBooking = exports.lockSeat = exports.updateReservationStatusBooked = exports.updateReservationStatusExpired = exports.findSeatsByReservationId = exports.findReservationById = exports.releaseSeatsByReservation = exports.markSeatsHeld = exports.createReservationSeats = exports.createReservation = exports.findSeatsByIds = void 0;
const prisma_1 = require("../../config/prisma");
const reservation_types_1 = require("./reservation.types");
const findSeatsByIds = async (seatIds) => {
    const seats = await prisma_1.prisma.seat.findMany({
        where: {
            id: { in: seatIds }
        }
    });
    return seats;
};
exports.findSeatsByIds = findSeatsByIds;
const createReservation = async (tx, userId, expiresAt) => {
    const reservation = await tx.reservation.create({
        data: {
            userId,
            expiresAt
        }
    });
    return reservation;
};
exports.createReservation = createReservation;
const createReservationSeats = async (tx, reservationId, seatIds) => {
    await tx.reservationSeat.createMany({
        data: seatIds.map(seatId => ({
            reservationId,
            seatId
        }))
    });
};
exports.createReservationSeats = createReservationSeats;
const markSeatsHeld = async (tx, seatIds, userId, heldUntil) => {
    await tx.seat.updateMany({
        where: {
            id: { in: seatIds },
        },
        data: {
            status: reservation_types_1.SeatStatus.HELD,
            heldById: userId,
            heldUntil
        }
    });
};
exports.markSeatsHeld = markSeatsHeld;
const lockSeat = async (tx, seatId, version, userId, heldUntil) => {
    const result = await tx.seat.updateMany({
        where: {
            id: seatId,
            version,
            status: reservation_types_1.SeatStatus.AVAILABLE
        },
        data: {
            status: reservation_types_1.SeatStatus.HELD,
            heldById: userId,
            heldUntil,
            version: {
                increment: 1
            }
        }
    });
    return result.count;
};
exports.lockSeat = lockSeat;
const findReservationById = async (tx, reservationId) => {
    const reservation = await tx.reservation.findUnique({
        where: {
            id: reservationId
        },
    });
    return reservation;
};
exports.findReservationById = findReservationById;
const findSeatsByReservationId = async (tx, reservationId) => {
    const seats = await tx.seat.findMany({
        where: {
            reservationSeats: {
                some: {
                    reservationId
                }
            }
        }
    });
    return seats;
};
exports.findSeatsByReservationId = findSeatsByReservationId;
const updateReservationStatusExpired = async (tx, reservationId, status) => {
    const result = await tx.reservation.updateMany({
        where: {
            id: reservationId,
            status: reservation_types_1.ReservationStatus.ACTIVE,
            expiresAt: {
                lte: new Date()
            }
        },
        data: {
            status
        }
    });
    return result.count;
};
exports.updateReservationStatusExpired = updateReservationStatusExpired;
const updateReservationStatusBooked = async (tx, reservationId, status) => {
    const result = await tx.reservation.updateMany({
        where: {
            id: reservationId,
            status: reservation_types_1.ReservationStatus.ACTIVE,
            expiresAt: {
                gt: new Date()
            }
        },
        data: {
            status
        }
    });
    return result.count;
};
exports.updateReservationStatusBooked = updateReservationStatusBooked;
const releaseSeatsByReservation = async (tx, reservationId) => {
    const result = await tx.seat.updateMany({
        where: {
            reservationSeats: {
                some: {
                    reservationId,
                }
            }
        },
        data: {
            status: reservation_types_1.SeatStatus.AVAILABLE,
            heldById: null,
            heldUntil: null
        }
    });
    return result.count;
};
exports.releaseSeatsByReservation = releaseSeatsByReservation;
const createBooking = async (tx, userId, reservationId) => {
    const booking = await tx.booking.create({
        data: {
            userId,
            reservationId
        }
    });
    return booking;
};
exports.createBooking = createBooking;
const markSeatsBooked = async (tx, reservationId) => {
    await tx.seat.updateMany({
        where: {
            reservationSeats: {
                some: {
                    reservationId
                }
            }
        },
        data: {
            status: reservation_types_1.SeatStatus.BOOKED,
            heldById: null,
            heldUntil: null
        }
    });
};
exports.markSeatsBooked = markSeatsBooked;
//# sourceMappingURL=reservation.repository.js.map