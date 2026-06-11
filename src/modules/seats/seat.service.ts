import { findSeatsByEventId } from "./seat.repository";

const getSeats=async(eventId:string)=>{

    const seats= await findSeatsByEventId(eventId);
    return seats;
}

export {getSeats}