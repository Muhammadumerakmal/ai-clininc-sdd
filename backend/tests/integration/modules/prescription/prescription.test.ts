import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../../src/app";

describe("Prescription API", () => {
  it("should require auth for list", async () => {
    const res = await request(app).get("/api/v1/prescriptions");
    expect(res.status).toBe(401);
  });

  it("should require auth for create", async () => {
    const res = await request(app).post("/api/v1/prescriptions").send({});
    expect(res.status).toBe(401);
  });

  it("should require auth for get by id", async () => {
    const res = await request(app).get("/api/v1/prescriptions/123");
    expect(res.status).toBe(401);
  });

  it("should require auth for update", async () => {
    const res = await request(app).put("/api/v1/prescriptions/123").send({});
    expect(res.status).toBe(401);
  });

  it("should require auth for approve", async () => {
    const res = await request(app).put("/api/v1/prescriptions/123/approve").send({ approved: true });
    expect(res.status).toBe(401);
  });

  it("should require auth for patient prescriptions", async () => {
    const res = await request(app).get("/api/v1/prescriptions/patient/123");
    expect(res.status).toBe(401);
  });
});
