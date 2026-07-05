import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../../src/app";

describe("Report API", () => {
  it("should require auth for dashboard", async () => {
    const res = await request(app).get("/api/v1/reports/dashboard");
    expect(res.status).toBe(401);
  });

  it("should require auth for revenue", async () => {
    const res = await request(app).get("/api/v1/reports/revenue");
    expect(res.status).toBe(401);
  });

  it("should require auth for appointments report", async () => {
    const res = await request(app).get("/api/v1/reports/appointments");
    expect(res.status).toBe(401);
  });
});
