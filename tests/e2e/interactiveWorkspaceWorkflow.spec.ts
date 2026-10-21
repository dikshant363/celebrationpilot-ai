import { test, expect } from '@playwright/test';

test.describe('E2E: Deep Workspace Interactions & Budget Deficit Workflow', () => {
  test('tests custom timeline milestone, budget overrun alert, vendor quote update, and export', async ({ page }) => {
    // 1. Launch sample celebration directly from home page
    await page.goto('/');
    await page.getByRole('button', { name: /Load Sample Wedding Suite/i }).click();

    // 2. Arrives at Concepts
    await expect(page).toHaveURL(/.*\/concepts/, { timeout: 15000 });

    // 3. Select concept and proceed to workspace
    await page.getByRole('button', { name: /Open Workspace for Selected Concept/i }).click();
    await expect(page).toHaveURL(/.*\/workspace/);

    // 4. Test Schedule milestone creation
    await page.getByRole('tab', { name: /Run of Show/i }).click();
    await page.getByRole('button', { name: /Add Milestone/i }).click();
    await page.getByPlaceholder(/Time \(e\.g\. 19:30\)/i).fill('20:15');
    await page.getByPlaceholder(/Milestone Title/i).fill('Golden Hour Champagne Toast');
    await page.getByPlaceholder(/Operational Lead/i).fill('Maid of Honor');
    await page.getByRole('button', { name: /Save Milestone/i }).click();

    await expect(page.getByText('Golden Hour Champagne Toast')).toBeVisible();

    // 5. Test Budget Line & Overrun Detection
    await page.getByRole('tab', { name: /Budget & Math/i }).click();
    await page.getByRole('button', { name: /Add Budget Line/i }).click();
    await page.getByPlaceholder(/Category Name/i).fill('Luxury Fireworks Finale');
    await page.getByPlaceholder(/Allocated Amount/i).fill('5000');
    // Spent exceeds total remaining budget to trigger deficit warning
    await page.getByPlaceholder(/Spent So Far/i).fill('45000');
    await page.getByPlaceholder(/Operational Notes/i).fill('Grand pyrotechnic show over lake');
    await page.getByRole('button', { name: /Save Budget Line/i }).click();

    await expect(page.getByText('Luxury Fireworks Finale')).toBeVisible();
    await expect(page.getByText('Budget Overrun Detected')).toBeVisible();

    // 6. Test Vendor Directory Interaction & Contract Quote
    await page.getByRole('tab', { name: /Vendors & Quotes/i }).click();
    await page.getByRole('button', { name: /Add Vendor/i }).click();
    await page.getByPlaceholder(/Vendor \/ Company Name/i).fill('Starlight Pyrotechnics LLC');
    await page.getByPlaceholder(/Service Scope/i).fill('Outdoor Lake Fireworks');
    await page.getByPlaceholder(/Estimated Cost/i).fill('4500');
    await page.getByRole('button', { name: /Save Vendor/i }).click();

    await expect(page.getByText('Starlight Pyrotechnics LLC')).toBeVisible();

    // 7. Navigate to Export Dossier
    await page.getByRole('main').getByRole('link', { name: /Export Dossier/i }).click();
    await expect(page).toHaveURL(/.*\/export/);
    await expect(page.getByText(/Printable Celebration Dossier/i)).toBeVisible();
    await expect(page.getByText(/Master Event Dossier/i)).toBeVisible();
  });
});
