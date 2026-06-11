"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationExpirationQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
exports.reservationExpirationQueue = new bullmq_1.Queue("reservation-expiration", {
    connection: redis_1.connection,
});
//# sourceMappingURL=reservation.queue.js.map