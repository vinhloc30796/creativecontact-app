import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

describe("prevalidateStaff", () => {
  const MOCK_STAFF_PASSWORD = "test_password_123";

  beforeEach(async () => {
    // Clear module cache before each test
    // https://github.com/vitest-dev/vitest/issues/4232
    vi.resetModules();
    // Set up environment variable
    vi.stubEnv("STAFF_PASSWORD", MOCK_STAFF_PASSWORD);
  });

  it("should return success when password matches environment variable", async () => {
    // Dynamically import the module after setting up the env
    const { prevalidateStaff } = await import(
      "@/app/actions/auth/prevalidateStaff"
    );

    const result = await prevalidateStaff(MOCK_STAFF_PASSWORD);

    expect(result).toEqual({
      data: true,
      error: null,
    });
  });

  it("should return error when password does not match", async () => {
    const { prevalidateStaff } = await import(
      "@/app/actions/auth/prevalidateStaff"
    );

    const result = await prevalidateStaff("wrong_password");

    expect(result).toEqual({
      data: false,
      error: {
        code: "INVALID_PASSWORD",
        message: "Invalid password",
      },
    });
  });

  it("should use default password if environment variable is not set", async () => {
    // Clear environment variables and module cache
    vi.resetModules();
    vi.unstubAllEnvs();

    const { prevalidateStaff } = await import(
      "@/app/actions/auth/prevalidateStaff"
    );

    const result = await prevalidateStaff("your_default_password_here");

    expect(result).toEqual({
      data: true,
      error: null,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });
});
