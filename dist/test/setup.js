"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../config/logger");
const vitest_1 = require("vitest");
(0, vitest_1.beforeAll)(async () => {
    logger_1.logger.info("Starting tests...");
});
(0, vitest_1.afterAll)(async () => {
    logger_1.logger.info("Tests complete");
});
//# sourceMappingURL=setup.js.map