import { test, expect } from '@playwright/test';

test.describe('E2E: Direct Route Access & Empty State Resilience', () => {
  test('renders informative empty state when visiting /concepts without brief', async ({
    page,
  }) => {
    await page.goto('/concepts');
    await expect(
      page.getByText(/No Celebration Concepts Available/i)
    ).toBeVisible();
    const link = page.getByRole('link', { name: /Start Event Brief Wizard/i });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/.*\/planner/);
  });

  test('renders informative empty state when visiting /workspace without brief', async ({
    page,
  }) => {
    await page.goto('/workspace');
    await expect(
      page.getByText(/No Active Celebration Workspace/i)
    ).toBeVisible();
    const link = page.getByRole('link', { name: /Create Celebration Brief/i });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/.*\/planner/);
  });

  test('renders informative empty state when visiting /export without brief', async ({ page }) => {
    await page.goto('/export');
    await expect(
      page.getByText(/No Celebration Plan to Export/i)
    ).toBeVisible();
  });
});
