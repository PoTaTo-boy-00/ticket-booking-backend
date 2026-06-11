import { Router } from "express";
import { getSeatController } from "./seat.controller";
import { validateParams } from "../../middleware/validate.middleware";
import { eventParamsSchema } from "../../validations/events.validation";

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

seatRouter.get("/events/:eventId/seats", validateParams(eventParamsSchema) ,getSeatController)

export default seatRouter