import { test, expect } from '@playwright/test';
import path from 'path';
import { mkdirSync } from 'fs';
import { authConfig } from '../config/authConfig';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { SupportersPage, SupporterFormData } from '../pages/SupportersPage';

const STORAGE_STATE_PATH = path.join(process.cwd(), 'storage-states', 'auth.json');

test.describe('Critical Path E2E Test', () => {
  test.describe.configure({ mode: 'serial' });

  test('Verify The Art of Gratitude login via UI and API', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Navigate to login
    await loginPage.navigate(authConfig.baseUrl);

    // Perform login
    await loginPage.login(authConfig.email, authConfig.password);

    // Wait for UI to stabilise and verify dashboard
    await page.waitForLoadState('networkidle');
    await dashboardPage.expectWelcomeHeadingVisible();

    const apiResponse = await page.evaluate<{
      ok: boolean;
      status: number;
      body: unknown;
      contentType: string | null;
    }>(async () => {
      const res = await fetch('/v1/rpc/is_admin', { credentials: 'include' });
      const contentType = res.headers.get('content-type');

      let body: unknown = null;
      if (contentType && contentType.includes('application/json')) {
        try {
          body = await res.json();
        } catch {
          body = null;
        }
      } else {
        try {
          body = await res.text();
        } catch {
          body = null;
        }
      }

      return { ok: res.ok, status: res.status, body, contentType };
    });

    expect(apiResponse.ok).toBeTruthy();
    expect(apiResponse.status).toBe(200);
    if (apiResponse.contentType?.includes('application/json')) {
      expect(apiResponse.body).toBeTruthy();
    }

    // Persist storage state for subsequent tests
    mkdirSync(path.dirname(STORAGE_STATE_PATH), { recursive: true });
    await page.context().storageState({ path: STORAGE_STATE_PATH });
  });

  test('create a new supporter', async ({ browser }) => {
    const context = await browser.newContext({ storageState: STORAGE_STATE_PATH });
    const page = await context.newPage();
    const dashboardPage = new DashboardPage(page);
    const supportersPage = new SupportersPage(page);

    await page.goto(`${authConfig.baseUrl}/dashboard`);
    await dashboardPage.expectWelcomeHeadingVisible();

    const supporterData = generateSupporterData();

    await supportersPage.openFromNavigation();
    await supportersPage.addSupporter(supporterData);
    await supportersPage.expectSupporterInList(supporterData);

    await context.close();
  });
});

function generateSupporterData(): SupporterFormData {
  const uniqueId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    firstName: `Auto${uniqueId}`,
    lastName: `Supporter${uniqueId}`,
    address: 'News Bridge Road,',
    email: `supporter+${uniqueId}@example.com`,
    giftTier: 'Oak'
  };
}


