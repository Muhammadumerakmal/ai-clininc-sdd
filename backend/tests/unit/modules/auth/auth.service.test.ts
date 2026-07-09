import { describe, it, expect, vi, beforeEach } from "vitest";

const mockRepo = vi.hoisted(() => ({ findByEmail: vi.fn(), findById: vi.fn(), create: vi.fn(), updateRefreshToken: vi.fn() }));

vi.mock("../../../../src/modules/auth/repositories/auth.repository", () => ({
  AuthRepository: vi.fn(() => mockRepo),
}));

vi.mock("../../../../src/modules/auth/services/password.service", () => ({
  hashPassword: vi.fn().mockResolvedValue("hashed-pass"),
  verifyPassword: vi.fn(),
}));

vi.mock("../../../../src/modules/auth/services/token.service", () => ({
  generateAccessToken: vi.fn().mockReturnValue("access-token"),
  generateRefreshToken: vi.fn().mockReturnValue("refresh-token"),
  verifyRefreshToken: vi.fn(),
}));

vi.mock("../../../../src/config/logger", () => ({ logger: { info: vi.fn() } }));

import { AuthService } from "../../../../src/modules/auth/services/auth.service";
import { verifyPassword } from "../../../../src/modules/auth/services/password.service";
import { verifyRefreshToken } from "../../../../src/modules/auth/services/token.service";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AuthService();
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const mockUser = { id: "1", email: "test@test.com", name: "Test", role: "Patient" };
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue(mockUser as any);

      const result = await service.register("test@test.com", "password123", "Test", "Patient");
      expect(result).toBeDefined();
      expect(result.email).toBe("test@test.com");
      expect(mockRepo.create).toHaveBeenCalledOnce();
    });

    it("should throw if email already exists", async () => {
      mockRepo.findByEmail.mockResolvedValue({ id: "1" } as any);
      await expect(service.register("test@test.com", "password123", "Test", "Patient")).rejects.toThrow("Email already registered");
    });
  });

  describe("login", () => {
    it("should login with valid credentials", async () => {
      mockRepo.findByEmail.mockResolvedValue({ id: "1", email: "test@test.com", name: "Test", role: "Patient", isActive: true, passwordHash: "hash", clinicId: null } as any);
      vi.mocked(verifyPassword).mockResolvedValue(true);
      mockRepo.updateRefreshToken.mockResolvedValue(undefined as any);

      const result = await service.login("test@test.com", "password123");
      expect(result.accessToken).toBe("access-token");
      expect(result.user.email).toBe("test@test.com");
    });

    it("should throw if email not found", async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      await expect(service.login("test@test.com", "pass")).rejects.toThrow("Invalid email or password");
    });

    it("should throw if account is deactivated", async () => {
      mockRepo.findByEmail.mockResolvedValue({ isActive: false } as any);
      await expect(service.login("test@test.com", "pass")).rejects.toThrow("Account is deactivated");
    });

    it("should throw if password is wrong", async () => {
      mockRepo.findByEmail.mockResolvedValue({ id: "1", isActive: true, passwordHash: "hash" } as any);
      vi.mocked(verifyPassword).mockResolvedValue(false);
      await expect(service.login("test@test.com", "wrongpass")).rejects.toThrow("Invalid email or password");
    });
  });

  describe("refresh", () => {
    it("should refresh tokens with valid refresh token", async () => {
      vi.mocked(verifyRefreshToken).mockReturnValue({ userId: "1", role: "Patient" } as any);
      mockRepo.findById.mockResolvedValue({ id: "1", isActive: true, clinicId: null } as any);
      mockRepo.updateRefreshToken.mockResolvedValue(undefined as any);

      const result = await service.refresh("valid-refresh-token");
      expect(result.accessToken).toBe("access-token");
      expect(result.refreshToken).toBe("refresh-token");
    });

    it("should throw if user not found", async () => {
      vi.mocked(verifyRefreshToken).mockReturnValue({ userId: "1" } as any);
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.refresh("token")).rejects.toThrow("Invalid or expired refresh token");
    });

    it("should throw if token is invalid", async () => {
      vi.mocked(verifyRefreshToken).mockImplementation(() => { throw new Error("Invalid"); });
      await expect(service.refresh("bad-token")).rejects.toThrow("Invalid or expired refresh token");
    });
  });

  describe("logout", () => {
    it("should clear refresh token", async () => {
      await service.logout("1");
      expect(mockRepo.updateRefreshToken).toHaveBeenCalledWith("1", null);
    });
  });
});
