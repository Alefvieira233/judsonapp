import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3000);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

// On Windows the dev script needs `--webpack` (Turbopack hits known issues
// with our Sentry/next-intl plugin combo). Override via E2E_DEV_CMD if you
// already have a server running.
const DEFAULT_DEV_CMD =
  process.platform === "win32"
    ? "npm run dev -- --webpack"
    : "npm run dev";
const DEV_CMD = process.env.E2E_DEV_CMD ?? DEFAULT_DEV_CMD;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  timeout: 30_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Skip auto-spawning the dev server when E2E_BASE_URL is provided —
  // useful when running against a deployed preview.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: DEV_CMD,
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        stdout: "pipe",
        stderr: "pipe",
      },
});
