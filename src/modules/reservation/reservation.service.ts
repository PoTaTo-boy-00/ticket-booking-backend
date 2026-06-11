import { ReservationStatus, Seat, SeatStatus } from "@prisma/client";
import { createBooking, createReservation, createReservationSeats, findReservationById, findSeatsByIds, findSeatsByReservationId, lockSeat, markSeatsBooked, markSeatsHeld, releaseSeatsByReservation, updateReservationStatusBooked, updateReservationStatusExpired } from "./reservation.repository"
import { Tx,Booking } from "./reservation.types";
import { prisma } from "../../config/prisma";
import { reservationExpirationQueue } from "../../jobs/queue/reservation.queue";
import { emitSeatEvents } from "../../socket/seat.events";
import AppError from "../../errors/AppError";
import { logger } from "../../config/logger";

const EXPIRATION_TIME=15*1000; // 15 minutes in milliseconds

const reserveSeats=async(eventId:string,seatIds:string[],userId:string)=>{
    const expiresAt = new Date(
  Date.now() + EXPIRATION_TIME
);
    const seats=await findSeatsByIds(seatIds);

    const seatExits=seats.length===seatIds.length;
    if(!seatExits){
        
        throw new AppError("One or more seats do not exist",400);
    }
    const allAvailable=seats.every(seat=>seat.status===SeatStatus.AVAILABLE);
    if(!allAvailable){
        throw new AppError("One or more seats are not available",400);
    }
    const reservation=await prisma.$transaction(async(tx:Tx)=>{

        for(const seat of seats){
            const locked=await lockSeat(tx,seat.id,seat.version,userId,expiresAt);
            if(locked===0){
                throw new AppError(
    `Seat ${seat.id} is no longer available`,409
);
            }
        }
        const reservation=await createReservation(tx,userId,expiresAt);
        await createReservationSeats(tx,reservation.id,seatIds);
        
       
        return reservation;
    })
logger.info(
  `Reservation ${reservation.id} added to expiration queue`
);
if(process.env.NODE_ENV!=="test"){
 for(const seat of seats){
            emitSeatEvents(
                eventId,
                seat.id,SeatStatus.HELD)
        }
    }
    await reservationExpirationQueue.add("expire-reservation",{
        eventId,
        reservationId:reservation.id,
    },{
        delay: EXPIRATION_TIME ,
        removeOnComplete: 100,
        removeOnFail: 100,
    })
    return reservation;

}

const expireReservation=async(eventId:string,reservationId:string):Promise<void>=>{
    const seats=await prisma.$transaction(async(tx:Tx)=>{
        
        
        const updatedReservations=await updateReservationStatusExpired(tx,reservationId,ReservationStatus.EXPIRED);
        if(updatedReservations===0){
            logger.info(
  `Reservation ${reservationId} cannot be expired. It may have already been confirmed or expired.`
);
            return;
        }
        
        const seats=await findSeatsByReservationId(tx,reservationId)
        await releaseSeatsByReservation(tx,reservationId);
        logger.info(
            `Reservation ${reservationId} expired`
        );
        return seats;

    })
    if(!seats){
        return;
    }
    if(process.env.NODE_ENV!=="test"){
    for(const seat of seats){
        emitSeatEvents(eventId,seat.id,SeatStatus.AVAILABLE)
    }
}

}



const confirmReservation=async(eventId:string,reservationId:string):Promise<Booking>=>{
    let seats:Seat[]=[]
    const booking=await prisma.$transaction(async(tx:Tx)=>{
        const reservation=await findReservationById(tx,reservationId);
        if(!reservation){
            throw new AppError("Reservation not found",404);
        }
        const updatedReservations=await updateReservationStatusBooked(tx,reservationId,ReservationStatus.CONFIRMED)
        if(updatedReservations===0){
            throw new AppError("Reservation cannot be confirmed. It may have expired or already been confirmed.",409);
        }
        const booking=await createBooking(tx,reservation.userId,reservationId);
        await markSeatsBooked(tx,reservationId)
         seats=await findSeatsByReservationId(tx,reservationId)
        return booking;
    })
    if(seats.length===0){
        return booking;
    }
    if(process.env.NODE_ENV!=="test"){
    for(const seat of seats){
        emitSeatEvents(eventId,seat.id,SeatStatus.BOOKED)
    }
}
    return booking;
}

export {
    reserveSeats,
    expireReservation,
    confirmReservation
}