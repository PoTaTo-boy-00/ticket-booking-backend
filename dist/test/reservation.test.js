"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const vitest_1 = require("vitest");
(0, vitest_1.describe)("Reservation API", () => {
    //        it(
    //   "confirms a reservation",
    //   async () => {
    //     // Create reservation first
    //     const reservationResponse =
    //       await request(app)
    //         .post("/api/reservations")
    //         .send({
    //           eventId: "dec542cd-1afa-42b1-a143-f6fd8cfb4352",
    //           userId: "befd8037-ce85-486e-bae0-817320e0cae5",
    //           seatIds: ["62249b97-929d-4f54-a9f6-f23386733119"]
    //         });
    //     const reservationId =
    //       reservationResponse.body.reservationId;
    //     // Confirm reservation
    //     const confirmResponse =
    //       await request(app)
    //         .post(
    //           `/api/reservations/${reservationId}/confirm`
    //         )
    //         .send({
    //           eventId: "dec542cd-1afa-42b1-a143-f6fd8cfb4352"
    //         });
    //     expect(
    //       confirmResponse.status
    //     ).toBe(200);
    //   }
    // );
    // it(
    //   "prevents double reservation",
    //   async () => {
    //     await request(app)
    //       .post("/api/reservations")
    //       .send({
    //         eventId: "dec542cd-1afa-42b1-a143-f6fd8cfb4352",
    //         userId: "befd8037-ce85-486e-bae0-817320e0cae5",
    //         seatIds: ["1b515726-3822-4a9f-bb30-5b15e3d503e8","2147e5c1-232e-473d-a2ba-bf072d9c1921"]
    //       });
    //     const response =
    //       await request(app)
    //         .post("/api/reservations")
    //         .send({
    //           eventId: "dec542cd-1afa-42b1-a143-f6fd8cfb4352",
    //           userId: "8854fc51-04bf-4408-a56b-2f1ccf59707e",
    //           seatIds: ["1b515726-3822-4a9f-bb30-5b15e3d503e8","41ff4ad0-2b62-45cc-9a1d-af033344115a"]
    //         });
    //     expect(response.status).toBe(400); // or 409 depending on your implementation
    //   }
    // );
    // it(
    //   "prevents confirming a reservation twice",
    //   async () => {
    //     const reservationResponse =
    //       await request(app)
    //         .post("/api/reservations")
    //         .send({
    //           eventId: "dec542cd-1afa-42b1-a143-f6fd8cfb4352",
    //           userId: "befd8037-ce85-486e-bae0-817320e0cae5",
    //           seatIds: ["2147e5c1-232e-473d-a2ba-bf072d9c1921"]
    //         });
    //     const reservationId =
    //       reservationResponse.body.reservationId;
    //     const firstConfirmation =
    //       await request(app)
    //         .post(
    //           `/api/reservations/${reservationId}/confirm`
    //         )
    //         .send({
    //           eventId: "dec542cd-1afa-42b1-a143-f6fd8cfb4352"
    //         });
    //     expect(
    //       firstConfirmation.status
    //     ).toBe(200);
    //     const secondConfirmation =
    //       await request(app)
    //         .post(
    //           `/api/reservations/${reservationId}/confirm`
    //         )
    //         .send({
    //           eventId: "dec542cd-1afa-42b1-a143-f6fd8cfb4352"
    //         });
    //     expect(
    //       secondConfirmation.status
    //     ).toBe(409);
    //       // change to 409 if that's what your API returns
    //   }
    // );
    (0, vitest_1.it)("prevents confirming an expired reservation", async () => {
        const reservationResponse = await (0, supertest_1.default)(app_1.default)
            .post("/api/reservations")
            .send({
            eventId: "dec542cd-1afa-42b1-a143-f6fd8cfb4352",
            userId: "befd8037-ce85-486e-bae0-817320e0cae5",
            seatIds: ["a200e6e3-b20d-422a-8ffe-002f42bc27e5"]
        });
        const reservationId = reservationResponse.body.reservationId;
        await new Promise(resolve => setTimeout(resolve, 2000));
        const confirmResponse = await (0, supertest_1.default)(app_1.default)
            .post(`/api/reservations/${reservationId}/confirm`)
            .send({
            eventId: "dec542cd-1afa-42b1-a143-f6fd8cfb4352"
        });
        (0, vitest_1.expect)(confirmResponse.status).toBe(409);
        // or 409 depending on implementation
    });
});
//# sourceMappingURL=reservation.test.js.map