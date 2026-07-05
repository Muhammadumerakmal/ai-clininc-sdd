import { describe, it, expect, vi } from "vitest";
import jwt from "jsonwebtoken";

vi.mock("../../../../src/config/env", () => ({
  env: { ACCESS_TOKEN_SECRET: "access-secret", REFRESH_TOKEN_SECRET: "refresh-secret", ACCESS_TOKEN_EXPIRY: "15m", REFRESH_TOKEN_EXPIRY: "7d" },
}));

import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../../../src/modules/auth/services/token.service";

describe("TokenService", () => {
  describe("generateAccessToken", () => {
    it("should generate a JWT token", () => {
      const token = generateAccessToken({ userId: "u1", role: "Doctor" });
      expect(typeof token).toBe("string");
      const decoded = jwt.decode(token) as { userId: string; role: string };
      expect(decoded.userId).toBe("u1");
      expect(decoded.role).toBe("Doctor");
    });
  });

  describe("generateRefreshToken", () => {
    it("should generate a refresh token", () => {
      const token = generateRefreshToken({ userId: "u1", role: "Doctor" });
      expect(typeof token).toBe("string");
    });
  });

  describe("verifyRefreshToken", () => {
    it("should verify a valid refresh token", () => {
      const token = generateRefreshToken({ userId: "u1", role: "Admin" });
      const payload = verifyRefreshToken(token);
      expect(payload.userId).toBe("u1");
      expect(payload.role).toBe("Admin");
    });

    it("should throw for invalid token", () => {
      expect(() => verifyRefreshToken("invalid-token")).toThrow();
    });

    it("should throw for access token (wrong secret)", () => {
      const accessToken = generateAccessToken({ userId: "u1", role: "Admin" });
      expect(() => verifyRefreshToken(accessToken)).toThrow();
    });
  });
});
