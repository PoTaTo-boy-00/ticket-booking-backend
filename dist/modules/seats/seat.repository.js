"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSeatsByEventId = void 0;
const prisma_1 = require("../../config/prisma");
const findSeatsByEventId = async (eventId) => {
    const seats = await prisma_1.prisma.seat.findMany({
        where: {
            eventId
        },
        select: {
            id: true,
            rowLabel: true,
            seatNumber: true,
            status: true
        },
        orderBy: {
            rowLabel: "asc",
            seatNumber: "asc"
        }
    });
    return seats.map(seats => ({
        seatId: seats.id,
        rowLabel: seats.rowLabel,
        seatNumber: seats.seatNumber,
        status: seats.status
    }));
};
exports.findSeatsByEventId = findSeatsByEventId;
//# sourceMappingURL=seat.repository.js.map