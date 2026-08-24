import { test, expect } from '@playwright/test';

test('Sidebar - Navigation All Items', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await page.locator('#add-to-cart-sauce-labs-backpack').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

  await page.locator('#react-burger-menu-btn').click();

  const allItemsLink = page.locator('#inventory_sidebar_link');
  await allItemsLink.waitFor({ state: 'visible' });
  await allItemsLink.click();

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});