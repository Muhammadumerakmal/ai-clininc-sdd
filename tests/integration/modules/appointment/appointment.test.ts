import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../../src/app";

describe("Appointment API", () => {
  describe("GET /api/v1/appointments", () => {
    it("should require authentication", async () => {
      const res = await request(app).get("/api/v1/appointments");
      expect(res.status).toBe(401);
    });
  });
});
