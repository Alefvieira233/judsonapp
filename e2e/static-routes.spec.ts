import { expect, test, type ConsoleMessage } from "@playwright/test";

const ROUTES = [
  "/",
  "/login",
  "/aluna/entrar",
  "/termos",
  "/privacidade",
  "/offline",
];

test.describe("static routes smoke", () => {
  for (const route of ROUTES) {
    test(`GET ${route} returns 200 with a non-empty title`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));
      page.on("console", (msg: ConsoleMessage) => {
        if (msg.type() === "error") errors.push(msg.text());
      });

      const res = await page.goto(route);
      expect(res?.status(), `${route} status`).toBeLessThan(400);

      const title = await page.title();
      expect(title.length, `${route} title length`).toBeGreaterThan(0);

      // Allow expected noisy logs (e.g. PWA SW registration in dev),
      // but flag anything that smells like a hydration mismatch.
      const hydrationErrors = errors.filter((e) =>
        /hydrat|hydration/i.test(e),
      );
      expect(hydrationErrors, `${route} hydration errors`).toEqual([]);
    });
  }
});
