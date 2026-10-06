import { expect, test } from "@playwright/test";

test("health API returns ok", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.status).toBe("ok");
  expect(body.service).toBe("vitalis");
});

test("home page loads", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.ok() || res?.status() === 307 || res?.status() === 302).toBeTruthy();
});
