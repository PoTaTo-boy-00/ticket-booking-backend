import { prisma } from "../config/prisma";

const EVENT_ID = "dec542cd-1afa-42b1-a143-f6fd8cfb4352";

async function generateSeats() {
  const sections = ["A", "B", "C" ,"D", "E"];
  const seatsPerSection = 10
  const seats = [];

  for (const section of sections) {
    for (let seatNumber = 1; seatNumber <= seatsPerSection; seatNumber++) {
      seats.push({
        eventId: EVENT_ID,
        section,
        rowLabel: section,
        seatNumber,
        status: "AVAILABLE" as const,
      });
    }
  }

  await prisma.seat.createMany({
    data: seats,
    skipDuplicates: true,
  });

  console.log(`${seats.length} seats created`);
}

generateSeats()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });