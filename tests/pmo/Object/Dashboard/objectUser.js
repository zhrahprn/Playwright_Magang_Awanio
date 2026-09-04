import { expect } from '@playwright/test';
import locatorUser from '../../Locator/Dashboard/locatorUser.js';

export default class UserPage {
    constructor(page) {
        this.page = page;
        this.accountMenu = page.getByTestId(locatorUser.accountMenu);
        this.userMenu = page.getByTestId(locatorUser.userMenu);
        this.createUserBtn = page.getByTestId(locatorUser.createUserBtn);
        this.createFormSubmitBtn = page.getByTestId(locatorUser.createFormSubmitBtn);
        this.moreActionTrigger = page.getByTestId(locatorUser.moreActionTrigger);
        this.viewDetailBtn = page.getByTestId(locatorUser.viewDetailBtn);
        this.updateBtn = page.getByTestId(locatorUser.updateBtn);
        this.deleteBtn = page.getByTestId(locatorUser.deleteBtn);
        this.nameInput = page.getByTestId(locatorUser.nameInput);
        this.usernameInput = page.getByTestId(locatorUser.usernameInput);
        this.emailInput = page.getByTestId(locatorUser.emailInput);
        this.passwordInput = page.getByTestId(locatorUser.passwordInput);
        this.passwordConfirmInput = page.getByTestId(locatorUser.passwordConfirmInput);
        this.orgQuotaInput = page.locator('input[inputmode="decimal"]');
        this.radioActive = page.locator('#radio-active');
        this.radioInactive = page.getByTestId(locatorUser.radioInactive);
        this.deleteConfirmInput = page.getByTestId(locatorUser.deleteConfirmInput);
        this.deleteSubmitBtn = page.getByTestId(locatorUser.deleteSubmitBtn);
        this.deleteUserLabel = page.locator('span.font-medium.text-primary').first();
    }

    async navigateToUser() {
        if (!(await this.userMenu.isVisible())) {
            await this.accountMenu.click();
        }
        await this.userMenu.click();
        await this.page.waitForURL('**/users', { waitUntil: 'domcontentloaded' });
    }

   async generateDynamicUserName(prefix = 'testing') {
    const numberWords = ['satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh'];

    // Ensure main layout is loaded
    const mainContainer = this.page.locator('main');
    await mainContainer.waitFor({ state: 'visible' });

    // Extract inner texts across matching elements
    const contentTexts = await mainContainer.allInnerTexts();
    const fullText = contentTexts.join(' ');

    for (let i = 0; i < numberWords.length; i++) {
        const targetName = `${prefix}-${numberWords[i]}`;
        
        if (!fullText.includes(targetName)) {
            return targetName;
        }
    }

    return `${prefix}-${Date.now()}`;
}

    async createUser() {
        await this.navigateToUser();
        const dynamicName = await this.generateDynamicUserName('testing');
        const email = `${dynamicName}@gmail.com`;
        const password = 'Passw0rd!';

        await this.createUserBtn.click();
        await this.page.waitForURL('**/users/create', { waitUntil: 'domcontentloaded' });

        await this.nameInput.fill(dynamicName);
        await this.usernameInput.fill(dynamicName);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.passwordConfirmInput.fill(password);

        await this.createFormSubmitBtn.click();
        await this.page.waitForURL('**/users', { waitUntil: 'domcontentloaded' });
        await this.verifyUserVisible(dynamicName);

        return dynamicName;
    }

   async updateUser() {
    await this.navigateToUser();

    await this.moreActionTrigger.first().click();
    await this.viewDetailBtn.click();
    await this.page.waitForURL('**/users/*', { waitUntil: 'domcontentloaded' });

    await this.moreActionTrigger.first().click();
    await this.updateBtn.click();
    const currentName = await this.nameInput.inputValue();
    const updatedName = `${currentName}-updated`;
    await this.nameInput.fill(updatedName);
    await this.usernameInput.fill(updatedName);

    const currentQuotaVal = await this.orgQuotaInput.inputValue();
    const currentQuotaNum = parseInt(currentQuotaVal || '0', 10);
    await this.orgQuotaInput.fill((currentQuotaNum + 1).toString());

    const isActiveChecked = await this.radioActive.isChecked().catch(() => false);
    if (isActiveChecked) {
        await this.radioInactive.click();
    } else {
        await this.radioActive.click();
    }

    await this.createFormSubmitBtn.click();

    await expect(this.page.locator('main').getByText(updatedName).first()).toBeVisible();

    return updatedName;
}
    async deleteUser() {
        await this.navigateToUser();
        await this.moreActionTrigger.first().click();
        await this.deleteBtn.click();

        await this.deleteUserLabel.waitFor({ state: 'visible' });
        const cleanUserName = (await this.deleteUserLabel.textContent()).trim();

        await this.deleteConfirmInput.fill(cleanUserName);
        await expect(this.deleteSubmitBtn).toBeEnabled();
        await this.deleteSubmitBtn.click();

        await expect(this.page.getByText(cleanUserName)).not.toBeVisible();

        return cleanUserName;
    }

    async verifyUserVisible(userName) {
        await expect(this.page.locator('main table').getByText(userName, { exact: false }).first()).toBeVisible();
    }

    async verifyUserNotVisible(userName) {
        await expect(this.page.locator('main table').getByText(userName, { exact: false })).not.toBeVisible();
    }
}