import { prisma } from "../../config/prisma";
import { Booking, Reservation, ReservationStatus, Seats, SeatStatus, Tx } from "./reservation.types";


const findSeatsByIds = async (
  seatIds: string[]
) : Promise<Seats> => {
    const seats=await prisma.seat.findMany({
        where:{
            id:{in:seatIds}
        }
    })
    return seats;
};

const createReservation = async (
  tx:Tx,
  userId: string,
  expiresAt: Date
):Promise<Reservation> => {
  const reservation=await tx.reservation.create({
    data:{
      userId,
      expiresAt
    }
  })
return reservation;
};

const createReservationSeats = async (
  tx:Tx,
  reservationId: string,
  seatIds: string[]
):Promise<void> => {
await tx.reservationSeat.createMany({
    data:seatIds.map(seatId=>({
      reservationId,
      seatId
    }))
  })
  
};

const markSeatsHeld = async (
  tx:Tx,
  seatIds: string[],
  userId: string,
  heldUntil: Date
):Promise<void> => {
  await tx.seat.updateMany({
   where:{
    id:{in:seatIds},
   },
   data:{
    status:SeatStatus.HELD,
    heldById:userId,
    heldUntil
   }
  })
};
const lockSeat=async(tx:Tx
  ,seatId:string,
  version:number,
  userId:string,
  heldUntil:Date):Promise<number>=>{
const result=await tx.seat.updateMany({
  where:{
    id:seatId,
    version,
    status:SeatStatus.AVAILABLE
  },
  data:{
    status:SeatStatus.HELD,
    heldById:userId,
    heldUntil,
    version:{
      increment:1
    }
  }
})
return result.count;
}

const findReservationById=async(tx:Tx,reservationId:string):Promise<Reservation|null>=>{
  const reservation=await tx.reservation.findUnique({
    where:{
      id:reservationId
    },
  })
  return reservation;
}

const  findSeatsByReservationId=async(tx:Tx,reservationId:string):Promise<Seats>=>{
  const seats=await tx.seat.findMany({
    where:{
      reservationSeats:{
        some:{
          reservationId
        }
      }
    }
  })
  return seats;
}

const updateReservationStatusExpired=async(tx:Tx, reservationId:string, status:ReservationStatus ):Promise<number>=>{
  const result=await tx.reservation.updateMany({
    where:{
      id:reservationId,
      status:ReservationStatus.ACTIVE,
      expiresAt:{
        lte:new Date()
      }
    },
    data:{
      status
    }
  })
  return result.count;
}
const updateReservationStatusBooked=async(tx:Tx, reservationId:string, status:ReservationStatus ):Promise<number>=>{
  const result=await tx.reservation.updateMany({
    where:{
      id:reservationId,
      status:ReservationStatus.ACTIVE,
      expiresAt:{
        gt:new Date()
      }
    },
    data:{
      status
    }
  })
  return result.count;
}

const releaseSeatsByReservation=async(
  tx: Tx,
  reservationId: string
): Promise<number> => {
  const result = await tx.seat.updateMany({
    where:{
      reservationSeats:{
        some:{
          reservationId,
        }
      }
    }
    ,
    data:{
      status:SeatStatus.AVAILABLE,
      heldById:null,
      heldUntil:null
    }
  })
  return result.count;
}

const createBooking=async(tx:Tx,userId:string,reservationId:string):Promise<Booking>=>{
  const booking=await tx.booking.create({
    data:{
      userId,
      reservationId
    }
  })
  return booking;
}

const markSeatsBooked=async(tx:Tx,reservationId:string):Promise<void>=>{
  await tx.seat.updateMany({
    where:{
      reservationSeats:{
        some:{
          reservationId
        }
      }
    },
    data:{
      status:SeatStatus.BOOKED,
      heldById:null,
      heldUntil:null
    }
  })
}



export { findSeatsByIds, 
  createReservation,
  createReservationSeats,
   markSeatsHeld, 
  releaseSeatsByReservation, 
  findReservationById,
    findSeatsByReservationId,
  updateReservationStatusExpired,
  updateReservationStatusBooked,
  lockSeat,
  createBooking ,
  markSeatsBooked
};