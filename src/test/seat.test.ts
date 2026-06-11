import request from "supertest";
import app from "../app";
import {describe,it,expect} from "vitest"

describe(
  "Seat API",
  () => {

    it(
      "returns seats",
      async () => {

        const response =
          await request(app)
            .get(
              "/api/events/dec542cd-1afa-42b1-a143-f6fd8cfb4352/seats"
            );

        expect(
          response.status
        ).toBe(200);

        expect(
          response.body.success
        ).toBe(true);

        expect(
          response.body.data.length
        ).toBeGreaterThan(0);

      }
    );

  }
);