import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

vi.mock("../../../src/config/database.js", () => ({}));
vi.mock("../../../src/models/User.js", () => ({
  User: {
    findOne: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    create: vi.fn(),
  },
}));

import { AuthService } from "../../../src/modules/auth/services/auth.service.js";
import { User } from "../../../src/models/User.js";

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const mockUser = { id: "1", email: "test@test.com", name: "Test", role: "Patient", toObject: () => ({}) };
      vi.mocked(User.findOne).mockResolvedValue(null);
      vi.mocked(User.create).mockResolvedValue(mockUser as any);

      const result = await authService.register("test@test.com", "password123", "Test", "Patient");
      expect(result).toBeDefined();
      expect(User.create).toHaveBeenCalledOnce();
    });

    it("should throw if email already exists", async () => {
      vi.mocked(User.findOne).mockResolvedValue({ id: "1" } as any);
      await expect(authService.register("test@test.com", "password123", "Test", "Patient")).rejects.toThrow("Email already registered");
    });
  });
});
