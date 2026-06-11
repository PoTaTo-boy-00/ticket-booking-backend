import { Queue } from "bullmq";
import { connection } from "../../config/redis";
import { ReservationExpirationJob } from "../../modules/reservation/reservation.types";

export const reservationExpirationQueue=new Queue<ReservationExpirationJob>("reservation-expiration", 
    {
        connection,
    }
)