"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const vitest_1 = require("vitest");
(0, vitest_1.describe)("Seat API", () => {
    (0, vitest_1.it)("returns seats", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get("/api/events/dec542cd-1afa-42b1-a143-f6fd8cfb4352/seats");
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.success).toBe(true);
        (0, vitest_1.expect)(response.body.data.length).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=seat.test.js.map