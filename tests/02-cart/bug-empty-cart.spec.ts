import { test, expect } from '@playwright/test';

test('Cart Management - Checkout Without Adding Item', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page.locator('#shopping_cart_container')).toHaveText('');

  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

  const checkoutButton = page.locator('#checkout');
  await checkoutButton.click();

  await expect(page).not.toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

});