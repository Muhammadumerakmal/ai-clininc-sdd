import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../../src/app";

describe("Doctor API", () => {
  it("should require auth for list", async () => {
    const res = await request(app).get("/api/v1/doctors");
    expect(res.status).toBe(401);
  });

  it("should require auth for create", async () => {
    const res = await request(app).post("/api/v1/doctors").send({});
    expect(res.status).toBe(401);
  });

  it("should require auth for get by id", async () => {
    const res = await request(app).get("/api/v1/doctors/123");
    expect(res.status).toBe(401);
  });

  it("should require auth for update", async () => {
    const res = await request(app).put("/api/v1/doctors/123").send({});
    expect(res.status).toBe(401);
  });

  it("should require auth for leave request", async () => {
    const res = await request(app).post("/api/v1/doctors/123/leave").send({});
    expect(res.status).toBe(401);
  });

  it("should require auth for get leaves", async () => {
    const res = await request(app).get("/api/v1/doctors/123/leave");
    expect(res.status).toBe(401);
  });
});
