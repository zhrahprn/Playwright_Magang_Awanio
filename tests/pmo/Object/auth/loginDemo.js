import { expect } from '@playwright/test';
import locatorLogin from '../../Locator/auth/locatorLogin';

export default class loginDemo {
    constructor(page) {
        this.page = page;

        this.inputUsername = page.locator(locatorLogin.inputUsername);
        this.inputPassword = page.locator(locatorLogin.inputPassword);
        this.buttonLogin = page.locator(locatorLogin.buttonLogin);
    }

    async goto() {
        await this.page.goto('https://platform.demo.awanio.com/', {
            waitUntil: 'domcontentloaded'
        });
    }

    async login(username, password) {
        
        await this.page.waitForSelector(locatorLogin.inputUsername, { state: 'visible', timeout: 30000 });

        await this.inputUsername.fill(username);
        await this.inputPassword.fill(password);
        await this.buttonLogin.click();

        await expect(this.page.getByText("Invalid login")).not.toBeVisible();
    }
}