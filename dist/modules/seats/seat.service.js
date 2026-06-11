"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeats = void 0;
const seat_repository_1 = require("./seat.repository");
const getSeats = async (eventId) => {
    const seats = await (0, seat_repository_1.findSeatsByEventId)(eventId);
    return seats;
};
exports.getSeats = getSeats;
//# sourceMappingURL=seat.service.js.map