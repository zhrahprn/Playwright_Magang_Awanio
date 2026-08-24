import { test, expect } from '@playwright/test';

test('checkout flow', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  await page.locator('#shopping_cart_container').click();
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

  await page.locator('#checkout').click();
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

  await page.locator('#first-name').fill('Zahrah');
  await page.locator('#last-name').fill('Purnama');
  await page.locator('#postal-code').fill('12345');
  await page.locator('#continue').click();

  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
  await page.locator('#finish').click();

  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
  await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
});