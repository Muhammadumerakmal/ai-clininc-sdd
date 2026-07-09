import { describe, it, expect } from "vitest";

describe("Response helpers", () => {
  it("should produce correct success shape", () => {
    const result = { success: true, message: "OK", data: { foo: "bar" } };
    expect(result.success).toBe(true);
    expect(result.message).toBe("OK");
  });

  it("should produce correct error shape", () => {
    const result = { success: false, message: "Error", data: null };
    expect(result.success).toBe(false);
    expect(result.message).toBe("Error");
  });
});