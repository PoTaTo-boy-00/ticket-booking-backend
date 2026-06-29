import { Router } from "express";
import { getSeatController } from "./seat.controller";
import { validateParams } from "../../middleware/validate.middleware";
import { eventParamsSchema } from "../../validation/event.validation";
import { logger } from "../../config/logger";
import authMiddleware from "../auth/auth.middleware";

const seatRouter=Router()
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

seatRouter.get("/events/:eventId/seats",authMiddleware, validateParams(eventParamsSchema) ,getSeatController)

export default seatRouter