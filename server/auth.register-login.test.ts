import { describe, expect, it, vi, beforeEach } from "vitest";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

// Mock db module
vi.mock("./db", () => ({
  getUserByEmail: vi.fn(),
  createEmailUser: vi.fn(),
  upsertUser: vi.fn(),
}));

// Mock sdk module
vi.mock("./_core/sdk", () => ({
  sdk: {
    createSessionToken: vi.fn().mockResolvedValue("mock-session-token"),
  },
}));

import * as db from "./db";
import { appRouter } from "./routers";

function createPublicContext() {
  const setCookies: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];

  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: Record<string, unknown>) => {
        setCookies.push({ name, value, options });
      },
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };

  return { ctx, setCookies };
}

describe("auth.register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new user and sets session cookie on success", async () => {
    const mockUser = {
      id: 1,
      openId: "email:test@example.com",
      email: "test@example.com",
      name: "Test User",
      passwordHash: "hashed",
      loginMethod: "email",
      role: "user" as const,
      preferredLanguage: "en",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    vi.mocked(db.getUserByEmail).mockResolvedValue(undefined);
    vi.mocked(db.createEmailUser).mockResolvedValue(mockUser);

    const { ctx, setCookies } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.register({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });

    expect(result.success).toBe(true);
    expect(result.user?.email).toBe("test@example.com");
    expect(setCookies).toHaveLength(1);
    expect(setCookies[0]?.name).toBe(COOKIE_NAME);
    expect(setCookies[0]?.value).toBe("mock-session-token");
  });

  it("throws CONFLICT error when email is already registered", async () => {
    const existingUser = {
      id: 1,
      openId: "email:existing@example.com",
      email: "existing@example.com",
      name: "Existing User",
      passwordHash: "hashed",
      loginMethod: "email",
      role: "user" as const,
      preferredLanguage: "en",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    vi.mocked(db.getUserByEmail).mockResolvedValue(existingUser);

    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.register({
        email: "existing@example.com",
        password: "password123",
        name: "Test User",
      })
    ).rejects.toThrow("This email is already registered");
  });

  it("rejects passwords shorter than 6 characters", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.register({
        email: "test@example.com",
        password: "123",
        name: "Test User",
      })
    ).rejects.toThrow();
  });
});

describe("auth.login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets session cookie on valid credentials", async () => {
    // Use a real bcrypt hash for "password123"
    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.hash("password123", 10);

    const mockUser = {
      id: 1,
      openId: "email:test@example.com",
      email: "test@example.com",
      name: "Test User",
      passwordHash: hash,
      loginMethod: "email",
      role: "user" as const,
      preferredLanguage: "en",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    vi.mocked(db.getUserByEmail).mockResolvedValue(mockUser);
    vi.mocked(db.upsertUser).mockResolvedValue(undefined);

    const { ctx, setCookies } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.login({
      email: "test@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
    expect(setCookies).toHaveLength(1);
    expect(setCookies[0]?.name).toBe(COOKIE_NAME);
  });

  it("throws UNAUTHORIZED on wrong password", async () => {
    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.hash("correctpassword", 10);

    const mockUser = {
      id: 1,
      openId: "email:test@example.com",
      email: "test@example.com",
      name: "Test User",
      passwordHash: hash,
      loginMethod: "email",
      role: "user" as const,
      preferredLanguage: "en",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    vi.mocked(db.getUserByEmail).mockResolvedValue(mockUser);

    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.login({
        email: "test@example.com",
        password: "wrongpassword",
      })
    ).rejects.toThrow("Invalid email or password");
  });

  it("throws UNAUTHORIZED when user not found", async () => {
    vi.mocked(db.getUserByEmail).mockResolvedValue(undefined);

    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.login({
        email: "notfound@example.com",
        password: "password123",
      })
    ).rejects.toThrow("Invalid email or password");
  });
});
