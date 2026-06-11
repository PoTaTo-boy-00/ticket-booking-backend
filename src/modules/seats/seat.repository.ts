import { prisma } from "../../config/prisma";
import { Seats } from "./seat.types";

const findSeatsByEventId = async (
  eventId: string
): Promise<Seats> => {
    // console.log("eventId:", eventId);
  const seats = await prisma.seat.findMany({
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

export { findSeatsByEventId };