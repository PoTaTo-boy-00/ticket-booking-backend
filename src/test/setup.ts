import { logger } from "../config/logger";
import { beforeAll, afterAll } from "vitest";

beforeAll(async () => {
  logger.info("Starting tests...");
});

afterAll(async () => {
  logger.info("Tests complete");
});