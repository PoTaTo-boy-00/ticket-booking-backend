import{ z }from "zod";

export const eventParamsSchema=z.object({
    eventId:z.uuid()
})