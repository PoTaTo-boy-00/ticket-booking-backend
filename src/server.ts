import app from "./app";
import http from "http";
import "./jobs/workers/reservation.worker"
import { initSocket } from "./config/socket";
import { logger } from "./config/logger";

const PORT = process.env.PORT || 5000;

const server=http.createServer(app)

initSocket(server);
server.listen(PORT, () => {
  logger.info(
    `Server running on port ${PORT}`
  );
});