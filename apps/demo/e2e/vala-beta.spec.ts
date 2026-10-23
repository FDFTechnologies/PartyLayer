import { test, expect } from '@playwright/test';

test('Vala appears in the generated directory and its Devnet beta integration page', async ({ page }) => {
  await page.goto('/wallets');
  const row = page.getByRole('row').filter({ has: page.getByRole('link', { name: 'Vala Wallet', exact: true }) });
  await expect(row).toContainText('Beta');
  await expect(row).toContainText('devnet');
  await row.getByRole('link', { name: 'Vala Wallet', exact: true }).click();
  await expect(page).toHaveURL(/\/wallets\/vala$/);
  await expect(page.getByRole('heading', { name: 'Vala wallet integration' })).toBeVisible();
  await expect(page.getByText('Beta integration · devnet', { exact: true })).toBeVisible();
  const logo = page.getByRole('img', { name: 'Vala Wallet logo' });
  await expect(logo).toBeVisible();
  expect(await logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(page.locator('main')).toContainText('channel="beta"');
});

test('the landing page adds Vala and its logo from the branch registry', async ({ page }) => {
  await page.goto('/');
  const grid = page.locator('#wallets');
  await expect(grid.getByRole('heading', { name: 'Vala Wallet', exact: true })).toBeVisible();
  const card = grid.getByRole('heading', { name: 'Vala Wallet', exact: true }).locator('..').locator('..');
  await expect(card).toContainText('Beta');
  await expect(card).toContainText('devnet');
  await expect(card.getByRole('link', { name: /Integration details/ })).toHaveAttribute('href', '/wallets/vala');
  expect(await card.getByRole('img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
});

test('the real Vala factory opens the registry Devnet login from the picker', async ({ page, context }) => {
  // Stub only the remote login page. This verifies the shipped factory and
  // browser popup path without pretending to exercise a real Vala account.
  await context.route('https://dev.vala-wallet.cc/login**', route => route.fulfill({
    contentType: 'text/html', body: '<h1>Vala test login</h1>',
  }));
  await page.goto('/kit-demo');
  await page.getByRole('button', { name: /Connect Wallet/i }).first().click();
  const modal = page.getByRole('dialog', { name: 'Connect Wallet', exact: true });
  const wallet = modal.getByRole('button', { name: /Vala Wallet/i });
  await expect(wallet).toBeVisible();
  await expect(wallet).toContainText('Beta');
  const popupPromise = context.waitForEvent('page');
  await wallet.click();
  const popup = await popupPromise;
  await expect(popup.getByRole('heading', { name: 'Vala test login' })).toBeVisible();
  const url = new URL(popup.url());
  expect(url.origin).toBe('https://dev.vala-wallet.cc');
  expect(url.pathname).toBe('/login');
  expect(url.searchParams.get('dappOrigin')).toBe(new URL(page.url()).origin);
  await popup.close();
});
