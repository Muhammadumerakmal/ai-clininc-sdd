import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";

describe("Lab API", () => {
  it("should require auth", async () => {
    const res = await request(app).post("/api/v1/lab-orders").send({});
    expect(res.status).toBe(401);
  });
});
