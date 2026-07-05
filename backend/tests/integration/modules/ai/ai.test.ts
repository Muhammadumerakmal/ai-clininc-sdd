import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../../src/app";

describe("AI API", () => {
  it("should require auth for chat", async () => {
    const res = await request(app).post("/api/v1/ai/chat").send({ message: "Hello" });
    expect(res.status).toBe(401);
  });

  it("should require auth for symptom analysis", async () => {
    const res = await request(app).post("/api/v1/ai/symptom-analysis").send({ symptoms: ["headache"] });
    expect(res.status).toBe(401);
  });

  it("should require auth for diagnosis suggestion", async () => {
    const res = await request(app).post("/api/v1/ai/diagnosis-suggestion").send({ symptoms: ["fever"] });
    expect(res.status).toBe(401);
  });

  it("should require auth for prescription draft", async () => {
    const res = await request(app).post("/api/v1/ai/prescription-draft").send({ diagnosis: "Hypertension", patientId: "1", doctorId: "2" });
    expect(res.status).toBe(401);
  });
});
