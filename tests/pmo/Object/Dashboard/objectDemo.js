import { expect } from '@playwright/test';
import locatorDemo from '../../Locator/Dashboard/locatorDemo';

export default class objectDemo {
    constructor(page) {
        this.page = page;

        // Navigation Locators
        this.computeMenu = page.getByRole(locatorDemo.computeMenuRole, { name: locatorDemo.computeMenuName });
        this.VMMenu = page.getByRole(locatorDemo.VMMenuRole, { name: locatorDemo.VMMenuName });
        this.createVMButton = page.getByTestId(locatorDemo.createVMButtonTestId);

        // Distribution Modal Locators
        this.seeAllDisributionButton = page.getByRole(locatorDemo.seeAllDisributionButtonRole, { name: locatorDemo.seeAllDisributionButtonName });
        this.distributionsModal = page.getByRole(locatorDemo.distributionsModalRole);
        this.ubuntuRadio = this.distributionsModal.getByRole('row', { name: locatorDemo.ubuntuRowText }).getByRole('radio');
        this.chooseButton = page.getByRole(locatorDemo.chooseButtonRole, { name: locatorDemo.chooseButtonName });

        // Plan Modal Locators
        this.choosePlanButton = page.getByRole(locatorDemo.choosePlanButtonRole, { name: locatorDemo.choosePlanButtonName });
        this.planModal = page.getByRole(locatorDemo.planModalRole);
        this.planSaRow = this.planModal.getByRole('row', { name: locatorDemo.planSaRowText });
        this.confirmPlanButton = page.getByRole(locatorDemo.confirmPlanButtonRole, { name: locatorDemo.confirmPlanButtonName, exact: true });

        // Auth Form Locators
        this.authUsername = page.getByRole(locatorDemo.authUsernameRole, { name: locatorDemo.authUsernameName });
        this.passwordTabButton = page.getByText(locatorDemo.passwordTabButtonText, { exact: true });
        this.authPassword = page.getByRole(locatorDemo.authPasswordRole, { name: locatorDemo.authPasswordName });

        // VM Detail Locators
        this.hostnameInput = page.locator(locatorDemo.hostnameInput).filter({ hasText: /^Choose a hostname/ }).getByRole('textbox');
        this.nameInput = page.locator(locatorDemo.nameInput).filter({ hasText: /^Name \*/ }).getByRole('textbox');

        // Submit Button
        this.submitButton = page.getByTestId(locatorDemo.submitButtonTestId);
    }

    async navigateToCreateVM() {
        await this.computeMenu.click();
        await expect(this.VMMenu).toBeVisible();
        await this.VMMenu.click();
        await expect(this.page).toHaveURL(/.*computes\/vms/);

        await expect(this.createVMButton).toBeVisible();
        await this.createVMButton.click();

        await expect(this.page).toHaveURL(/.*computes\/vms\/create/);
    }

    async selectDistributionUbuntu() {
        await this.seeAllDisributionButton.click();
        await expect(this.distributionsModal).toBeVisible();
        await this.ubuntuRadio.check();
        await this.chooseButton.click();
        await expect(this.distributionsModal).toBeHidden();
    }

    async selectCpuPreference(arch = 'x86_64', processor = 'Intel') {
        const archContainer = this.page.locator('div').filter({ hasText: /^Architecture/ });
        const archDropdown = archContainer.getByText('Default', { exact: true });
        await archDropdown.click();
        await this.page.getByText(arch, { exact: true }).click();

        const procDropdown = this.page.getByText('Select Processor');
        await expect(procDropdown).toBeVisible();
        await procDropdown.click();
        await this.page.getByText(processor, { exact: true }).click();
    }

    async selectPlanSa() {
        await this.choosePlanButton.click();
        await expect(this.planModal).toBeVisible();
        await this.planSaRow.click();
        await this.confirmPlanButton.click();
        await expect(this.planModal).toBeHidden();
    }

    async dismissModalIfPresent() {
        const modalCloseBtn = this.page.locator('dialog button').first();
        if (await modalCloseBtn.isVisible()) {
            await modalCloseBtn.click();
        }
    }

    async fillAuthentication(username, password) {
        await this.dismissModalIfPresent();
        await this.authUsername.fill(username);
        await this.passwordTabButton.click();
        await expect(this.authPassword).toBeVisible();
        await this.authPassword.fill(password);
    }

    async fillVMDetails(hostname, name) {
        await this.nameInput.scrollIntoViewIfNeeded();
        await this.hostnameInput.fill(hostname);
        await this.nameInput.fill(name);
    }

    async submitCreateVM() {
        await expect(this.submitButton).toBeEnabled();
        await this.submitButton.click();

        const errorDialog = this.page.getByRole('dialog').filter({ hasText: /quota/i });
        if (await errorDialog.isVisible()) {
            await expect(errorDialog).toContainText(/storage quota exceeded/i);
            throw new Error('VM creation failed due to storage quota limits.');
        }

        await expect(this.page).toHaveURL(/.*computes\/vms$/);
    }
}