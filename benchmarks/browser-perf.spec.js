
import { test, expect } from '@playwright/test';

test('ProjectsConstellation interaction performance', async ({ page }) => {
  // Go to the local dev server
  await page.goto('/');

  // Wait for the projects section to be visible
  // The component has text "PROJECTS" and "SELECTED_WORKS"
  await page.getByText('SELECTED_WORKS').scrollIntoViewIfNeeded();

  // Wait for animation
  await page.waitForTimeout(1000);

  const cards = page.locator('.project-card');
  await expect(cards.first()).toBeVisible();

  const iterations = 20;
  const startTime = Date.now();

  for (let i = 0; i < iterations; i++) {
    // Click the first card
    await cards.first().click();
  }

  const endTime = Date.now();
  console.log(`[Playwright] Benchmark Duration (${iterations} clicks): ${endTime - startTime}ms`);
});
