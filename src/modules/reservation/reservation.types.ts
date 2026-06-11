
import { Seat,Reservation,SeatStatus, Prisma, ReservationStatus,Booking } from '@prisma/client';


type Seats= Seat[];
type Reservations= Reservation[];
interface ReservationExpirationJob {
    eventId:string;
    reservationId: string;
}
type Tx=Prisma.TransactionClient;

export {  
    Seats, 
    Reservation,
    Reservations,
    SeatStatus,
    ReservationStatus,
    Tx,
    ReservationExpirationJob,
    Booking
};