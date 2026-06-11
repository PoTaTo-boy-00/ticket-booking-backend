"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeatController = void 0;
const seat_service_1 = require("./seat.service");
const asyncHandler_1 = require("../../utils/asyncHandler");
exports.getSeatController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const eventId = req.params.eventId;
    const seats = await (0, seat_service_1.getSeats)(Array.isArray(eventId) ? eventId[0] : eventId);
    return res.status(200).json({
        success: true,
        data: seats,
    });
});
//# sourceMappingURL=seat.controller.js.map