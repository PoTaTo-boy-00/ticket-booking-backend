"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const reservation_service_1 = require("../../modules/reservation/reservation.service");
const logger_1 = require("../../config/logger");
new bullmq_1.Worker("reservation-expiration", async (job) => {
    const { reservationId, eventId } = job.data;
    logger_1.logger.info(`Expiring reservation ${reservationId}`);
    try {
        await (0, reservation_service_1.expireReservation)(eventId, reservationId);
    }
    catch (error) {
        logger_1.logger.error(`Failed to expire reservation ${reservationId}: ${error.message}`);
        throw error;
    }
}, {
    connection: redis_1.connection
});
logger_1.logger.info("Reservation expiry worker running");
//# sourceMappingURL=reservation.worker.js.map