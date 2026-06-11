"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSeatsByEventId = void 0;
const prisma_1 = require("../../config/prisma");
const findSeatsByEventId = async (eventId) => {
    // console.log("eventId:", eventId);
    const seats = await prisma_1.prisma.seat.findMany({
        where: {
            eventId,
        },
        select: {
            id: true,
            rowLabel: true,
            seatNumber: true,
            status: true,
        },
        orderBy: [
            {
                rowLabel: "asc",
            },
            {
                seatNumber: "asc",
            },
        ],
    });
    // console.log(seats.length)
    return seats.map((seat) => ({
        id: seat.id,
        rowLabel: seat.rowLabel,
        seatNumber: seat.seatNumber,
        status: seat.status,
    }));
};
exports.findSeatsByEventId = findSeatsByEventId;
//# sourceMappingURL=seat.repository.js.map