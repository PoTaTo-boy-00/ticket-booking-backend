"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmReservationBodySchema = exports.confirmReservationParamsSchema = exports.reserveSeatSchema = void 0;
const zod_1 = require("zod");
exports.reserveSeatSchema = zod_1.z.object({
    eventId: zod_1.z.uuid(),
    seatIds: zod_1.z.array(zod_1.z.string()).min(1),
    userId: zod_1.z.uuid(),
});
exports.confirmReservationParamsSchema = zod_1.z.object({
    reservationId: zod_1.z.uuid(),
});
exports.confirmReservationBodySchema = zod_1.z.object({
    eventId: zod_1.z.uuid(),
});
//# sourceMappingURL=reservation.validation.js.map