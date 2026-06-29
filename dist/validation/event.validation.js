"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventParamsSchema = void 0;
const zod_1 = require("zod");
exports.eventParamsSchema = zod_1.z.object({
    eventId: zod_1.z.uuid()
});
//# sourceMappingURL=event.validation.js.map