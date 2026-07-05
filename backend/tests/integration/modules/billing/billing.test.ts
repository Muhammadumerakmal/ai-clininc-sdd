import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../../src/app";

describe("Billing API", () => {
  it("should require auth for list", async () => {
    const res = await request(app).get("/api/v1/billing");
    expect(res.status).toBe(401);
  });

  it("should require auth for create", async () => {
    const res = await request(app).post("/api/v1/billing").send({});
    expect(res.status).toBe(401);
  });

  it("should require auth for get by id", async () => {
    const res = await request(app).get("/api/v1/billing/123");
    expect(res.status).toBe(401);
  });

  it("should require auth for update", async () => {
    const res = await request(app).put("/api/v1/billing/123").send({});
    expect(res.status).toBe(401);
  });

  it("should require auth for payments", async () => {
    const res = await request(app).post("/api/v1/billing/payments").send({});
    expect(res.status).toBe(401);
  });

  it("should require auth for get payments", async () => {
    const res = await request(app).get("/api/v1/billing/123/payments");
    expect(res.status).toBe(401);
  });
});
