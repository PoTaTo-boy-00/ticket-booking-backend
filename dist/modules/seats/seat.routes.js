"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seat_controller_1 = require("./seat.controller");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const event_validation_1 = require("../../validation/event.validation");
const auth_middleware_1 = __importDefault(require("../auth/auth.middleware"));
const seatRouter = (0, express_1.Router)();
/**
 * @swagger
 * /events/{eventId}/seats:
 *   get:
 *     summary: Get seats for event
 *     tags:
 *       - Seats
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seats fetched
 *
 *
 */
seatRouter.get("/events/:eventId/seats", auth_middleware_1.default, (0, validate_middleware_1.validateParams)(event_validation_1.eventParamsSchema), seat_controller_1.getSeatController);
exports.default = seatRouter;
//# sourceMappingURL=seat.routes.js.map