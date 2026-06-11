interface SeatInterface{
    id:string;
    rowLabel:string;
    seatNumber:number;
    status:'AVAILABLE' | 'BOOKED' | 'HELD';
}

type Seats= SeatInterface[];

export {SeatInterface,Seats}