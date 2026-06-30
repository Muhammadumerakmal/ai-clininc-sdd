import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";

describe("Patient API", () => {
  describe("GET /api/v1/patients", () => {
    it("should require authentication", async () => {
      const res = await request(app).get("/api/v1/patients");
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/v1/patients", () => {
    it("should require authentication", async () => {
      const res = await request(app).post("/api/v1/patients").send({});
      expect(res.status).toBe(401);
    });
  });
});
