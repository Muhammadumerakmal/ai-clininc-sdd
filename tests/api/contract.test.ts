import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("API Contract Tests", () => {
  const endpoints = [
    { method: "GET", path: "/api/v1/health" },
    { method: "POST", path: "/api/v1/auth/register" },
    { method: "POST", path: "/api/v1/auth/login" },
    { method: "POST", path: "/api/v1/auth/refresh" },
    { method: "POST", path: "/api/v1/auth/logout" },
    { method: "GET", path: "/api/v1/patients" },
    { method: "GET", path: "/api/v1/appointments" },
    { method: "GET", path: "/api/v1/medical-records" },
    { method: "GET", path: "/api/v1/prescriptions" },
    { method: "GET", path: "/api/v1/lab-orders" },
    { method: "GET", path: "/api/v1/pharmacy" },
    { method: "GET", path: "/api/v1/doctors" },
    { method: "GET", path: "/api/v1/clinics" },
    { method: "GET", path: "/api/v1/billing" },
    { method: "GET", path: "/api/v1/notifications" },
    { method: "GET", path: "/api/v1/reports/dashboard" },
    { method: "POST", path: "/api/v1/ai/chat" },
  ];

  endpoints.forEach(({ method, path }) => {
    it(`should return consistent response structure for ${method} ${path}`, async () => {
      const res = await request(app)[method.toLowerCase() as "get" | "post"](path);
      expect(res.body).toHaveProperty("success");
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("data");
    });
  });
});
