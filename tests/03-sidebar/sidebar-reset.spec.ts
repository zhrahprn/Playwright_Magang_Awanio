import { test, expect } from '@playwright/test';

test('Sidebar - Reset App State', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  const buttonAddToCart = page.locator('#add-to-cart-sauce-labs-backpack');
  await buttonAddToCart.click();
  await expect(page.locator('#remove-sauce-labs-backpack')).toBeVisible();

  await page.locator('#react-burger-menu-btn').click();

  const resetLink = page.locator('#reset_sidebar_link');
  await resetLink.waitFor({ state: 'visible' });
  await resetLink.click();
  
  await expect(page.locator('#shopping_cart_container')).toHaveText('');
  await expect(buttonAddToCart).toBeVisible();
  await expect(buttonAddToCart).toHaveText('Add to cart');
});