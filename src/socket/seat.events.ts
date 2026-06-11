import { SeatStatus } from "@prisma/client";
import { getIO } from "../config/socket";

const emitSeatEvents = (
    eventId: string,
    seatId: string,
    seatEvent: SeatStatus
) => {
    const io = getIO();

    console.log(
        "Emitting seat:update",
        {
            eventId,
            seatId,
            seatEvent,
            clients: io.engine.clientsCount,
        }
    );

    io.emit("seat:update", {
        eventId,
        seatId,
        status: seatEvent,
    });
};

export{
    emitSeatEvents
}