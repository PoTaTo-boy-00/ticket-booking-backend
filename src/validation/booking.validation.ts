import {z} from "zod";

export const reserveSeatSchema= z.object({
    eventId:z.uuid(),
    seatIds:z.array(z.string()).min(1),
    userId:z.uuid(),
})

export const confirmReservationParamsSchema=z.object({
    reservationId:z.uuid(),
})
export const confirmReservationBodySchema=z.object({
    eventId:z.uuid(),
    name:z.string().min(1),
    email:z.string().email(),
})