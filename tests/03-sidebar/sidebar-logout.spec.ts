import { test, expect } from '@playwright/test';

test('Sidebar - Logout', async ({ page }) => {
  // 1. Login ke aplikasi
  await page.goto('https://www.saucedemo.com/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // 2. Buka sidebar menu di bagian samping
  await page.locator('#react-burger-menu-btn').click();

  // 3. Pilih opsi Log Out
  const logoutLink = page.locator('#logout_sidebar_link');
  await logoutLink.waitFor({ state: 'visible' });
  await logoutLink.click();

  // Expected Result: Sesi pengguna berakhir dan berhasil kembali ke halaman awal Login
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.locator('#login-button')).toBeVisible();
});