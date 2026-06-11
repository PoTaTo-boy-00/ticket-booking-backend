import {  Worker } from "bullmq";
import { connection } from "../../config/redis";
import { expireReservation } from "../../modules/reservation/reservation.service";
import { ReservationExpirationJob } from "../../modules/reservation/reservation.types";
import { logger } from "../../config/logger";

new Worker<ReservationExpirationJob>("reservation-expiration", async (job) => {
    const {reservationId,eventId}=job.data;
    logger.info(
    `Expiring reservation ${reservationId}`
);
    try {
        await expireReservation(eventId,reservationId);
    } catch (error: unknown) {
        logger.error(
            `Failed to expire reservation ${reservationId}: ${(error as Error).message}`
        );
        throw error;
    }

},{
    connection:connection
})
logger.info("Reservation expiry worker running")