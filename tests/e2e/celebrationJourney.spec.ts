import { test, expect } from '@playwright/test';

test.describe('E2E: CelebrationPilot AI Complete Journey', () => {
  test('navigates from landing page through wizard, concepts, workspace, and dossier export', async ({
    page,
  }) => {
    // 1. Visit Home
    await page.goto('/');
    await expect(page).toHaveTitle(/CelebrationPilot AI/i);
    await expect(
      page.getByRole('heading', { name: /Architect unforgettable celebrations/i })
    ).toBeVisible();

    // 2. Click Plan Your Celebration
    await page.getByRole('link', { name: /Plan Your Celebration/i }).click();
    await expect(page).toHaveURL(/.*\/planner/);
    await expect(page.getByRole('heading', { name: /Celebration Brief Wizard/i })).toBeVisible();

    // 3. Step 1: Event Fundamentals
    await page.getByLabel(/Event Title \/ Celebration Name/i).fill('Golden 50th Anniversary Gala');
    await page.getByLabel(/City \/ Destination/i).fill('San Francisco, CA');
    await page.getByRole('button', { name: /Next Step/i }).click();

    // 4. Step 2: Venue & Constraints
    await expect(page.getByText(/Step 2: Venue & Hard Constraints/i)).toBeVisible();
    await page.getByLabel(/Expected Guest Count/i).fill('80');
    await page.getByLabel(/Total Budget/i).fill('20000');
    await page.getByRole('button', { name: /Next Step/i }).click();

    // 5. Step 3: Aesthetic & Hospitality
    await expect(page.getByText(/Step 3: Aesthetic, Dietary & Priorities/i)).toBeVisible();
    await page.getByLabel(/Theme & Styling Aesthetic/i).fill('Classic Black Tie & Champagne Gold');

    // Submit generation
    await page.getByTestId('generate-plan-button').click();

    // 6. Arrive at Concepts
    await expect(page).toHaveURL(/.*\/concepts/, { timeout: 15000 });
    await expect(page.getByText(/3 Curated Celebration Archetypes/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Golden 50th Anniversary Gala' })).toBeVisible();

    // 7. Choose a plan and open workspace
    const chooseButtons = page.getByRole('button', { name: /Choose This Plan/i });
    if ((await chooseButtons.count()) > 0) {
      await chooseButtons.first().click();
    } else {
      await page.getByRole('button', { name: /Open Workspace for Selected Concept/i }).click();
    }

    // 8. Arrive at Workspace
    await expect(page).toHaveURL(/.*\/workspace/, { timeout: 15000 });
    await expect(page.getByText(/Active Celebration Workspace/i)).toBeVisible();
    await expect(page.getByText(/Master Run of Show/i)).toBeVisible();

    // Test switching tabs
    await page.getByRole('tab', { name: /Budget & Math/i }).click();
    await expect(page.getByText(/Total Budget/i)).toBeVisible();
    await expect(page.getByText(/Category Budget Allocation/i)).toBeVisible();

    await page.getByRole('tab', { name: /Checklist & Tasks/i }).click();
    await expect(page.getByText(/Milestone Checklist & Tasks/i)).toBeVisible();

    await page.getByRole('tab', { name: /Guests & RSVP/i }).click();
    await expect(page.getByText(/Guest List & RSVP Tracking/i)).toBeVisible();

    // 9. Navigate to Export Dossier
    await page.getByRole('main').getByRole('link', { name: /Export Dossier/i }).click();
    await expect(page).toHaveURL(/.*\/export/);
    await expect(
      page.getByRole('heading', { name: /Printable Celebration Dossier/i })
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: /Golden 50th Anniversary Gala/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Print \/ Save as PDF/i })).toBeVisible();
  });
});
