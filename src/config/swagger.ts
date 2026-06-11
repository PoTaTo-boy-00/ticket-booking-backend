import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ticket Booking API",
      version: "1.0.0",
      description:
        "Real-time ticket booking system API",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
  },

  apis: [
    "./src/modules/**/*.ts",
    "./src/app.ts",
  ],
};

export const swaggerSpec =
  swaggerJsdoc(options);