import { Request, Response } from "express";
import { getSeats } from "./seat.service";
import { asyncHandler } from "../../utils/asyncHandler";

export const getSeatController = asyncHandler(async (
  req: Request,
  res: Response
) => {

    const  eventId  = req.params.eventId;

    const seats = await getSeats(Array.isArray(eventId) ? eventId[0] : eventId);

    return res.status(200).json({
      success: true,
      data: seats,
    });
 
}
)