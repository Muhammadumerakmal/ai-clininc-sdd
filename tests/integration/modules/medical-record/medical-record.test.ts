import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../../src/app";

describe("Medical Record API", () => {
  it("should require auth", async () => {
    const res = await request(app).post("/api/v1/medical-records").send({});
    expect(res.status).toBe(401);
  });
});
