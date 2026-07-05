import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../../src/app";

describe("Notification API", () => {
  it("should require auth for list", async () => {
    const res = await request(app).get("/api/v1/notifications");
    expect(res.status).toBe(401);
  });

  it("should require auth for unread count", async () => {
    const res = await request(app).get("/api/v1/notifications/unread-count");
    expect(res.status).toBe(401);
  });

  it("should require auth for mark as read", async () => {
    const res = await request(app).put("/api/v1/notifications/123/read");
    expect(res.status).toBe(401);
  });

  it("should require auth for mark all as read", async () => {
    const res = await request(app).put("/api/v1/notifications/read-all");
    expect(res.status).toBe(401);
  });

  it("should require auth for send", async () => {
    const res = await request(app).post("/api/v1/notifications").send({});
    expect(res.status).toBe(401);
  });

  it("should return consistent response structure for list", async () => {
    const res = await request(app).get("/api/v1/notifications");
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("data");
  });
});
