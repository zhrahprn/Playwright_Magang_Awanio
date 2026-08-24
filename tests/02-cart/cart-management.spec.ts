import { test, expect } from '@playwright/test';

test('Add & Remove Item from Cart', async ({ page }) => {
 
  await page.goto('https://www.saucedemo.com/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  const buttonAddToCart = page.locator('#add-to-cart-sauce-labs-backpack');
  await buttonAddToCart.click();

  const buttonRemove = page.locator('#remove-sauce-labs-backpack');
  await expect(buttonRemove).toBeVisible();
  await expect(buttonRemove).toHaveText('Remove');
  await expect(page.locator('#shopping_cart_container')).toHaveText('1');

  await buttonRemove.click();

  await expect(buttonAddToCart).toBeVisible();
  await expect(buttonAddToCart).toHaveText('Add to cart');
  await expect(page.locator('#shopping_cart_container')).toHaveText('');
});