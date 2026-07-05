import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError, ValidationError } from "../../../../src/shared/errors";

const mockTokenRepo = vi.hoisted(() => ({ create: vi.fn(), findByToken: vi.fn(), markAsUsed: vi.fn(), invalidateUserTokens: vi.fn() }));
const mockAuthRepo = vi.hoisted(() => ({ findByEmail: vi.fn(), findById: vi.fn(), verifyEmail: vi.fn(), updatePassword: vi.fn() }));

vi.mock("../../../../src/modules/auth/repositories/token.repository", () => ({
  TokenRepository: vi.fn(() => mockTokenRepo),
}));

vi.mock("../../../../src/modules/auth/repositories/auth.repository", () => ({
  AuthRepository: vi.fn(() => mockAuthRepo),
}));

vi.mock("../../../../src/modules/auth/services/token.service", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual as object,
    generateRandomToken: vi.fn(),
  };
});

vi.mock("../../../../src/config/logger", () => ({ logger: { info: vi.fn() } }));

import { VerificationService } from "../../../../src/modules/auth/services/verification.service";
import { generateRandomToken } from "../../../../src/modules/auth/services/token.service";

describe("VerificationService", () => {
  let service: VerificationService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new VerificationService();
  });

  describe("verifyEmail", () => {
    it("should verify email with valid token", async () => {
      const mockRecord = { id: "t1", userId: "u1", type: "EMAIL_VERIFICATION", usedAt: null, expiresAt: new Date(Date.now() + 3600000) };
      mockTokenRepo.findByToken.mockResolvedValue(mockRecord);
      mockAuthRepo.verifyEmail.mockResolvedValue(undefined);
      mockTokenRepo.markAsUsed.mockResolvedValue(undefined);

      await service.verifyEmail("valid-token");
      expect(mockAuthRepo.verifyEmail).toHaveBeenCalledWith("u1");
      expect(mockTokenRepo.markAsUsed).toHaveBeenCalledWith("t1");
    });

    it("should throw NotFoundError for invalid token", async () => {
      mockTokenRepo.findByToken.mockResolvedValue(null);
      await expect(service.verifyEmail("bad-token")).rejects.toThrow(NotFoundError);
    });

    it("should throw ValidationError for already used token", async () => {
      mockTokenRepo.findByToken.mockResolvedValue({ type: "EMAIL_VERIFICATION", usedAt: new Date(), expiresAt: new Date(Date.now() + 3600000) });
      await expect(service.verifyEmail("used-token")).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError for expired token", async () => {
      mockTokenRepo.findByToken.mockResolvedValue({ type: "EMAIL_VERIFICATION", usedAt: null, expiresAt: new Date(Date.now() - 3600000) });
      await expect(service.verifyEmail("expired-token")).rejects.toThrow(ValidationError);
    });
  });

  describe("createEmailVerificationToken", () => {
    it("should create a verification token", async () => {
      vi.mocked(generateRandomToken).mockReturnValue("abc123");
      mockTokenRepo.invalidateUserTokens.mockResolvedValue(undefined);
      mockTokenRepo.create.mockResolvedValue({ token: "abc123" });
      const result = await service.createEmailVerificationToken("u1");
      expect(result).toBe("abc123");
    });
  });

  describe("createPasswordResetToken", () => {
    it("should create a reset token for existing user", async () => {
      vi.mocked(generateRandomToken).mockReturnValue("reset123");
      mockAuthRepo.findByEmail.mockResolvedValue({ id: "u1", email: "test@test.com" });
      mockTokenRepo.invalidateUserTokens.mockResolvedValue(undefined);
      mockTokenRepo.create.mockResolvedValue({ token: "reset123" });

      const result = await service.createPasswordResetToken("test@test.com");
      expect(result).toBe("reset123");
    });

    it("should return null for non-existent email", async () => {
      mockAuthRepo.findByEmail.mockResolvedValue(null);
      const result = await service.createPasswordResetToken("nonexistent@test.com");
      expect(result).toBeNull();
    });
  });

  describe("resetPassword", () => {
    it("should reset password with valid token", async () => {
      const mockRecord = { id: "t1", userId: "u1", type: "PASSWORD_RESET", usedAt: null, expiresAt: new Date(Date.now() + 3600000) };
      mockTokenRepo.findByToken.mockResolvedValue(mockRecord);
      mockAuthRepo.updatePassword.mockResolvedValue(undefined);
      mockTokenRepo.markAsUsed.mockResolvedValue(undefined);

      await service.resetPassword("valid-token", "newPass123");
      expect(mockAuthRepo.updatePassword).toHaveBeenCalledWith("u1", expect.any(String));
      expect(mockTokenRepo.markAsUsed).toHaveBeenCalledWith("t1");
    });

    it("should throw NotFoundError for invalid token", async () => {
      mockTokenRepo.findByToken.mockResolvedValue(null);
      await expect(service.resetPassword("bad-token", "newPass")).rejects.toThrow(NotFoundError);
    });
  });
});
