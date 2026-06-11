"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeatController = void 0;
const seat_service_1 = require("./seat.service");
const getSeatController = async (req, res) => {
    try {
        const eventId = Array.isArray(req.params.eventid) ? req.params.eventid[0] : (req.params.eventid || "");
        const seats = await (0, seat_service_1.getSeats)(eventId);
        return res.status(200).json({
            success: true,
            data: seats,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch seats",
        });
    }
};
exports.getSeatController = getSeatController;
//# sourceMappingURL=seat.controller.js.map