"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seat_controller_1 = require("./seat.controller");
const seatRouter = (0, express_1.Router)();
seatRouter.get("/events/:eventId/seats", seat_controller_1.getSeatController);
exports.default = seatRouter;
//# sourceMappingURL=seat.routes.js.map