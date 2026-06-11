"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitSeatEvents = void 0;
const socket_1 = require("../config/socket");
const emitSeatEvents = (eventId, seatId, seatEvent) => {
    const io = (0, socket_1.getIO)();
    console.log("Emitting seat:update", {
        eventId,
        seatId,
        seatEvent,
        clients: io.engine.clientsCount,
    });
    io.emit("seat:update", {
        eventId,
        seatId,
        status: seatEvent,
    });
};
exports.emitSeatEvents = emitSeatEvents;
//# sourceMappingURL=seat.events.js.map