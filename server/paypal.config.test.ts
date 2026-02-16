import { describe, it, expect } from "vitest";

describe("PayPal Configuration", () => {
  it("should have VITE_PAYPAL_CLIENT_ID environment variable configured", () => {
    const clientId = process.env.VITE_PAYPAL_CLIENT_ID;
    
    // 验证Client ID存在
    expect(clientId).toBeDefined();
    expect(clientId).not.toBe("");
    
    // 验证Client ID格式(PayPal Client ID通常以A开头,长度约80字符)
    expect(clientId).toMatch(/^A[A-Za-z0-9_-]{60,}$/);
    
    console.log("✓ PayPal Client ID configured successfully");
    console.log(`  Client ID prefix: ${clientId?.substring(0, 10)}...`);
  });

  it("should have valid PayPal Client ID length", () => {
    const clientId = process.env.VITE_PAYPAL_CLIENT_ID;
    
    // PayPal Client ID通常长度在70-90字符之间
    expect(clientId?.length).toBeGreaterThan(60);
    expect(clientId?.length).toBeLessThan(100);
  });
});
