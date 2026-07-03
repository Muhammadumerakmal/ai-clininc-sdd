import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../../src/app";

describe("Clinic API", () => {
  it("should require auth for list", async () => {
    const res = await request(app).get("/api/v1/clinics");
    expect(res.status).toBe(401);
  });

  it("should require auth for create", async () => {
    const res = await request(app).post("/api/v1/clinics").send({});
    expect(res.status).toBe(401);
  });

  it("should require auth for get by id", async () => {
    const res = await request(app).get("/api/v1/clinics/123");
    expect(res.status).toBe(401);
  });

  it("should require auth for update", async () => {
    const res = await request(app).put("/api/v1/clinics/123").send({});
    expect(res.status).toBe(401);
  });

  it("should require auth for departments list", async () => {
    const res = await request(app).get("/api/v1/clinics/123/departments");
    expect(res.status).toBe(401);
  });

  it("should require auth for create department", async () => {
    const res = await request(app).post("/api/v1/clinics/123/departments").send({ name: "Cardiology" });
    expect(res.status).toBe(401);
  });
});
