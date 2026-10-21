import { test, expect } from '@playwright/test';

test.describe('E2E: Event Wizard Validations & Error Handling', () => {
  test('blocks progression when required fields are missing on step 1', async ({ page }) => {
    await page.goto('/planner');
    await expect(page.getByRole('heading', { name: /Celebration Brief Wizard/i })).toBeVisible();

    // Click Next Step without filling title
    await page.getByRole('button', { name: /Next Step/i }).click();

    // Verify error messages
    await expect(
      page.getByText(/Event title must be at least 3 characters/i)
    ).toBeVisible();

    // Fill valid title and verify step progression
    await page.getByLabel(/Event Title \/ Celebration Name/i).fill('Sweet Sixteen Beach Party');
    await page.getByRole('button', { name: /Next Step/i }).click();

    // Arrives at Step 2
    await expect(page.getByText(/Step 2: Venue & Hard Constraints/i)).toBeVisible();
  });
});
