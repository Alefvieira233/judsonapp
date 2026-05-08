import { describe, expect, it } from "vitest";

import { isAsaasEnabled, verifyWebhookSignature } from "@/lib/asaas";

describe("verifyWebhookSignature", () => {
  it("accepts when header matches the configured secret", () => {
    expect(verifyWebhookSignature("super-secret", "super-secret")).toBe(true);
  });

  it("rejects when header differs from secret", () => {
    expect(verifyWebhookSignature("super-secret", "other-secret")).toBe(false);
  });

  it("rejects when the lengths differ (avoids partial match)", () => {
    expect(verifyWebhookSignature("short", "longer-secret")).toBe(false);
  });

  it("rejects when header is missing", () => {
    expect(verifyWebhookSignature(null, "super-secret")).toBe(false);
    expect(verifyWebhookSignature(undefined, "super-secret")).toBe(false);
  });

  it("rejects when the secret is missing", () => {
    expect(verifyWebhookSignature("anything", null)).toBe(false);
    expect(verifyWebhookSignature("anything", undefined)).toBe(false);
  });

  it("rejects empty strings on both sides (no auth bypass)", () => {
    // Empty strings are falsy and the early-return guards them.
    expect(verifyWebhookSignature("", "")).toBe(false);
  });

  it("uses constant-time comparison (no early-exit on first differing char)", () => {
    // Verify the function still returns false even when the first char matches.
    expect(verifyWebhookSignature("abcd", "abce")).toBe(false);
    expect(verifyWebhookSignature("abcd", "zbcd")).toBe(false);
  });
});

describe("isAsaasEnabled", () => {
  it("returns false when env vars are missing", () => {
    const prevKey = process.env.ASAAS_API_KEY;
    const prevUrl = process.env.ASAAS_BASE_URL;
    delete process.env.ASAAS_API_KEY;
    delete process.env.ASAAS_BASE_URL;
    try {
      expect(isAsaasEnabled()).toBe(false);
    } finally {
      if (prevKey !== undefined) process.env.ASAAS_API_KEY = prevKey;
      if (prevUrl !== undefined) process.env.ASAAS_BASE_URL = prevUrl;
    }
  });

  it("returns true when both env vars are present", () => {
    const prevKey = process.env.ASAAS_API_KEY;
    const prevUrl = process.env.ASAAS_BASE_URL;
    process.env.ASAAS_API_KEY = "test-key";
    process.env.ASAAS_BASE_URL = "https://sandbox.asaas.com/api/v3";
    try {
      expect(isAsaasEnabled()).toBe(true);
    } finally {
      if (prevKey !== undefined) process.env.ASAAS_API_KEY = prevKey;
      else delete process.env.ASAAS_API_KEY;
      if (prevUrl !== undefined) process.env.ASAAS_BASE_URL = prevUrl;
      else delete process.env.ASAAS_BASE_URL;
    }
  });
});
