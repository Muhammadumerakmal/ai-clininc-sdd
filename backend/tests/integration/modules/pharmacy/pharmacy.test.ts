import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../../src/app";

describe("Pharmacy API", () => {
  it("should require auth for list", async () => {
    const res = await request(app).get("/api/v1/pharmacy");
    expect(res.status).toBe(401);
  });

  it("should require auth for create", async () => {
    const res = await request(app).post("/api/v1/pharmacy").send({});
    expect(res.status).toBe(401);
  });

  it("should require auth for update", async () => {
    const res = await request(app).put("/api/v1/pharmacy/123").send({});
    expect(res.status).toBe(401);
  });

  it("should require auth for low stock", async () => {
    const res = await request(app).get("/api/v1/pharmacy/low-stock");
    expect(res.status).toBe(401);
  });

  it("should require auth for dispense", async () => {
    const res = await request(app).post("/api/v1/pharmacy/dispense").send({});
    expect(res.status).toBe(401);
  });
});
