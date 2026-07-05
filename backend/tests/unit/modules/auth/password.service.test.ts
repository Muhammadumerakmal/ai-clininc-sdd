import { describe, it, expect, vi } from "vitest";
import bcrypt from "bcryptjs";

vi.mock("../../../../src/config/logger", () => ({ logger: { info: vi.fn() } }));

import { hashPassword, verifyPassword } from "../../../../src/modules/auth/services/password.service";

describe("PasswordService", () => {
  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const hash = await hashPassword("testPass123");
      expect(hash).toBeTruthy();
      expect(typeof hash).toBe("string");
      expect(hash).not.toBe("testPass123");
    });
  });

  describe("verifyPassword", () => {
    it("should return true for correct password", async () => {
      const hash = await bcrypt.hash("correctPass", 4);
      const result = await verifyPassword("correctPass", hash);
      expect(result).toBe(true);
    });

    it("should return false for incorrect password", async () => {
      const hash = await bcrypt.hash("correctPass", 4);
      const result = await verifyPassword("wrongPass", hash);
      expect(result).toBe(false);
    });
  });
});
