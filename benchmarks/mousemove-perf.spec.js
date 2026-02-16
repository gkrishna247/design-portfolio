// @ts-check
import { test, expect } from '@playwright/test';

test('should minimize global mousemove listeners', async ({ page }) => {
  // Inject a script to intercept addEventListener calls before the page loads
  await page.addInitScript(() => {
    window._listenerCounts = {
      window: { mousemove: 0 },
      document: { mousemove: 0 }
    };
    window._stacks = [];

    const originalWindowAdd = window.addEventListener;
    const originalWindowRemove = window.removeEventListener;

    window.addEventListener = function(type, listener, options) {
      if (type === 'mousemove') {
        window._listenerCounts.window.mousemove++;
        window._stacks.push('ADD: ' + new Error().stack);
      }
      return originalWindowAdd.call(this, type, listener, options);
    };

    window.removeEventListener = function(type, listener, options) {
      if (type === 'mousemove') {
        window._listenerCounts.window.mousemove--;
        window._stacks.push('REMOVE: ' + new Error().stack);
      }
      return originalWindowRemove.call(this, type, listener, options);
    };

    const originalDocumentAdd = document.addEventListener;
    const originalDocumentRemove = document.removeEventListener;

    document.addEventListener = function(type, listener, options) {
      if (type === 'mousemove') {
        window._listenerCounts.document.mousemove++;
      }
      return originalDocumentAdd.call(this, type, listener, options);
    };

    document.removeEventListener = function(type, listener, options) {
      if (type === 'mousemove') {
        window._listenerCounts.document.mousemove--;
      }
      return originalDocumentRemove.call(this, type, listener, options);
    };
  });

  await page.goto('/');
  // Wait for hydration and potential component mounting
  await page.waitForTimeout(2000);

  const counts = await page.evaluate(() => window._listenerCounts);

  console.log('Listener counts:', counts);

  // Expectation:
  // After optimization: 1 (MouseContext only)
  expect(counts.window.mousemove).toBeLessThanOrEqual(1);
  expect(counts.document.mousemove).toBe(0);
});
