import { asyncHandler } from "../../utils/asyncHandler";
import { confirmReservation, reserveSeats } from "./reservation.service";
import { Request, Response } from "express";

export const reserveSeatsController=asyncHandler(async(req:Request,res:Response)=>{
    const {eventId,seatIds,userId}=req.body;
   
        const reservation=await reserveSeats(eventId,seatIds,userId);
        res.status(201).json({reservationId:reservation.id,expiresAt:reservation.expiresAt});
    
})

export const confirmReservationController=asyncHandler(async(req:Request,res:Response)=>{
    const reservationId=Array.isArray(req.params)?req.params[0].reservationId:req.params.reservationId;
    // console.log(reservationId)
    const {eventId}=req.body;
  
        const confirmedReservation=await confirmReservation(eventId,reservationId);
        res.status(200).json({reservationId:confirmedReservation.id});
    
})

