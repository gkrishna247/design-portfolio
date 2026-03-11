import { test, expect } from '@playwright/test';

test.describe('Orbital Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the local server
    await page.goto('/');
  });

  test('opens on click and executes spring animations', async ({ page }) => {
    // Initially, menu items shouldn't be visible in the DOM or should be hidden
    const orbitalNav = page.locator('nav.orbital-nav');

    // The core button
    const coreButton = page.locator('.orbital-core');
    await expect(coreButton).toBeVisible();

    // Menu list initially doesn't exist or is empty
    let menuItems = page.locator('.orbital-item');
    await expect(menuItems).toHaveCount(0);

    // Click the central orb
    await coreButton.click();

    // Verify nav gets expanded class
    await expect(orbitalNav).toHaveClass(/expanded/);

    // Verify items appear and have animations
    menuItems = page.locator('.orbital-item');
    await expect(menuItems).toHaveCount(6);

    // Check that items have transforms applied (meaning they sprang outwards)
    // We will pick the first item to ensure it has a style attribute reflecting x/y translation
    const firstItem = menuItems.nth(0);
    await expect(firstItem).toHaveCSS('transform', /matrix/);
    await expect(firstItem).toBeVisible();
  });

  test('closes on Escape key press', async ({ page }) => {
    const coreButton = page.locator('.orbital-core');
    const orbitalNav = page.locator('nav.orbital-nav');

    // Open the nav
    await coreButton.click();
    await expect(orbitalNav).toHaveClass(/expanded/);
    await expect(page.locator('.orbital-item')).toHaveCount(6);

    // Press Escape
    await page.keyboard.press('Escape');

    // Verify it closed
    await expect(orbitalNav).not.toHaveClass(/expanded/);

    // Due to Framer Motion AnimatePresence exit animations, it might take a moment to be removed from DOM,
    // but the count should eventually go back to 0
    await expect(page.locator('.orbital-item')).toHaveCount(0);
  });

  test('scroll-linked rotation functions without throwing console errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Ensure we can scroll
    // The inner core gets a style transform based on scroll progress
    const coreInner = page.locator('.orbital-core-inner');

    // Check initial transform
    const initialTransform = await coreInner.evaluate((el) => window.getComputedStyle(el).transform);

    // Scroll down the page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));

    // Wait a bit for scroll animation/transform to update
    await page.waitForTimeout(500);

    // Check new transform
    const newTransform = await coreInner.evaluate((el) => window.getComputedStyle(el).transform);

    // The transform should have changed
    expect(newTransform).not.toBe(initialTransform);

    // There should be no console errors
    expect(errors).toHaveLength(0);
  });
});
