import { expect } from '@playwright/test';
import locatorLogin from '../../Locator/auth/locatorLoginDashboard.js';

export default class loginDashboard {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator(locatorLogin.usernameInput);
    this.passwordInput = page.locator(locatorLogin.passwordInput);
    this.buttonLogin = page.locator(locatorLogin.loginButton);
  }
  
  async goto() {
    await this.page.goto('https://dash.demo.awanio.com/', {
      waitUntil: 'domcontentloaded',
    });
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.buttonLogin.click();

    await expect(this.page).toHaveURL('https://dash.demo.awanio.com/');
  }
}