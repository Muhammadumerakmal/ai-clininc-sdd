import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../../src/app";

describe("Auth API", () => {
  describe("POST /api/v1/auth/register", () => {
    it("should validate required fields", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject invalid email", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        email: "invalid",
        password: "password123",
        name: "Test",
      });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should require email and password", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({});
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/v1/health", () => {
    it("should return health status", async () => {
      const res = await request(app).get("/api/v1/health");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
