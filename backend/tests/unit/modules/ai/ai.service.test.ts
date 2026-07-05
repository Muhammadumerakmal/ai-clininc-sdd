import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../../src/config/env", () => ({
  env: { OPENAI_API_KEY: "" },
}));

vi.mock("../../../../src/modules/ai/repositories/ai.repository", () => ({
  AIRepository: vi.fn().mockImplementation(() => ({
    create: vi.fn(),
  })),
}));

vi.mock("../../../../src/config/logger", () => ({ logger: { info: vi.fn() } }));

import { AIService } from "../../../../src/modules/ai/services/ai.service";

describe("AIService", () => {
  let service: AIService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AIService();
  });

  describe("chat", () => {
    it("should return not configured message when no API key", async () => {
      const result = await service.chat("u1", "Hello");
      expect(result.reply).toContain("not configured");
      expect(result.isAIGenerated).toBe(false);
    });
  });

  describe("analyzeSymptoms", () => {
    it("should return not configured message when no API key", async () => {
      const result = await service.analyzeSymptoms("u1", ["headache"]);
      expect(result.analysis).toContain("not configured");
      expect(result.isAIGenerated).toBe(false);
    });
  });

  describe("suggestDiagnosis", () => {
    it("should return not configured message when no API key", async () => {
      const result = await service.suggestDiagnosis("u1", ["fever", "cough"]);
      expect(result.suggestions).toContain("not configured");
      expect(result.isAIGenerated).toBe(false);
    });
  });

  describe("draftPrescription", () => {
    it("should return not configured message when no API key", async () => {
      const result = await service.draftPrescription("u1", "Hypertension", "p1", "d1");
      expect(result.draft).toContain("not configured");
      expect(result.isAIGenerated).toBe(false);
    });
  });
});
