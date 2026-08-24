import { test, expect } from '@playwright/test';
import locatorLogin from '../Locator/locatorLogin.js';

export default class loginSauceAction {

    constructor(page) {
        this.page = page;
        this.locatorLogin = new locatorLogin();
        this.inputUsername = page.locator(this.locatorLogin.inputUsername);
        this.inputPassword = page.locator(this.locatorLogin.inputPassword);
        this.buttonLogin = page.locator(this.locatorLogin.buttonLogin);
        this.addToCart = page.locator(this.locatorLogin.addToCart);
        this.shoppingCart = page.locator(this.locatorLogin.shoppingCart);
        this.checkoutButton = page.locator(this.locatorLogin.checkoutButton);
        this.firstName = page.locator(this.locatorLogin.firstName);
        this.lastName = page.locator(this.locatorLogin.lastName);
        this.postalCode = page.locator(this.locatorLogin.postalCode);
        this.continue = page.locator(this.locatorLogin.continue);
        this.finish = page.locator(this.locatorLogin.finish);
    }

async goto (){
    await this.page.goto('https://www.saucedemo.com/');
}

async loginSauce(){
    await this.inputUsername.fill('standard_user');
    await expect(this.inputUsername).toHaveValue('standard_user');
    await this.inputPassword.fill('secret_sauce');
    await expect(this.inputPassword).toHaveValue('secret_sauce');
    await this.buttonLogin.click()
    await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
}

async addToCartSauce(){
    await this.addToCart.click();
    await this.shoppingCart.click();
    await expect(this.page).toHaveURL('https://www.saucedemo.com/cart.html');
}

async checkoutSauce(){
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
}

async fillCheckoutForm(){
    await this.firstName.fill('Zahrah');
    await expect(this.firstName).toHaveValue('Zahrah');
    await this.lastName.fill('Purnama');
    await expect(this.lastName).toHaveValue('Purnama');
    await this.postalCode.fill('12345');
    await expect(this.postalCode).toHaveValue('12345');
    await this.continue.click();
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');

}

async finishCheckout(){
    await this.finish.click();
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');

}
}
