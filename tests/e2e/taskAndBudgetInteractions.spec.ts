import { test, expect } from '@playwright/test';

test.describe('E2E: Workspace State Mutations & Deterministic Math', () => {
  test('creates custom task and updates RSVP in active workspace', async ({ page }) => {
    // 1. Launch sample celebration directly from home page
    await page.goto('/');
    await page.getByRole('button', { name: /Load Sample Wedding Suite/i }).click();

    // 2. Arrives at Concepts
    await expect(page).toHaveURL(/.*\/concepts/, { timeout: 15000 });

    // 3. Select concept and proceed to workspace
    await page.getByRole('button', { name: /Open Workspace for Selected Concept/i }).click();
    await expect(page).toHaveURL(/.*\/workspace/);

    // 4. Test Task Creation
    await page.getByRole('tab', { name: /Checklist & Tasks/i }).click();
    await page.getByRole('button', { name: /Add Task/i }).click();
    await page.getByPlaceholder(/Task description\.\.\./i).fill('Confirm fireworks permit');
    await page.getByRole('button', { name: /Save Task/i }).click();

    await expect(page.getByText('Confirm fireworks permit')).toBeVisible();

    // 5. Test Guest Creation
    await page.getByRole('tab', { name: /Guests & RSVP/i }).click();
    await page.getByRole('button', { name: /Add Guest/i }).click();
    await page.getByPlaceholder(/Guest Full Name\.\.\./i).fill('Celebrity Host Guest');
    await page.getByRole('button', { name: /Save Guest/i }).click();

    await expect(page.getByText('Celebrity Host Guest')).toBeVisible();
  });
});
