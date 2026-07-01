import { logger } from "../../config/logger";
import { asyncHandler } from "../../utils/asyncHandler";
import { confirmReservation, emailNotification, reserveSeats } from "./reservation.service";
import { Request, Response } from "express";

export const reserveSeatsController = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId, seatIds, userId } = req.body;

    const reservation = await reserveSeats(eventId, seatIds, userId);
    res
      .status(201)
      .json({
        reservationId: reservation.id,
        expiresAt: reservation.expiresAt,
      });
  },
);

export const confirmReservationController = asyncHandler(
  async (req: Request, res: Response) => {
    const reservationId = Array.isArray(req.params)
      ? req.params[0].reservationId
      : req.params.reservationId;
    // console.log(reservationId)
    const token = crypto.randomUUID();
    console.log(req.body);
    const { name, email, eventId } = req.body;
    if (!reservationId || !name || !email || !eventId) {
      throw new Error("Missing required fields");
    }
    const confirmedReservation = await confirmReservation(
      eventId,
      reservationId,
    );
    // send data to a bg-processoi
    // logger.info(`${name} ${email} token: ${token}`);
    // api call
    const semdEmail=await emailNotification(confirmedReservation.id, name, email, eventId);
    if(!semdEmail){
      throw new Error("Email notification failed");
    }
    logger.info(`Email sent: ${semdEmail}`);
    res.status(200).json({ reservationId: confirmedReservation.id });
  },
);
