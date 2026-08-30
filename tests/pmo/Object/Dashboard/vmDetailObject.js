import { expect } from '@playwright/test';
import vmDetailLocator from '../../Locator/Dashboard/vmDetailLocator.js';

export default class VmDetailObject {
    constructor(page) {
        this.page = page;
        this.backupTab = page.getByRole('tab', { name: 'Backups' });
        this.computeMenu = page.locator(vmDetailLocator.computeMenu);
        this.submenuVm = page.locator(vmDetailLocator.submenuVm);
        this.tableRow = page.locator(vmDetailLocator.tableRow);
        this.moreActionButton = page.locator(vmDetailLocator.moreActionButton);
        this.viewDetailLink = page.locator(vmDetailLocator.viewDetailLink);
        this.resizeTab = page.locator(vmDetailLocator.resizeTab);
        this.snapshotTab = page.locator(vmDetailLocator.snapshotTab);
        this.backupTab = page.locator(vmDetailLocator.backupTab);
        this.ramInput = page.locator(vmDetailLocator.ramInput).nth(1);
        this.updateButton = page.locator(vmDetailLocator.updateButton);
        this.confirmYesButton = page.locator(vmDetailLocator.confirmYesButton);
    }

    async navigateToVmMenu() {
        await this.computeMenu.click();
        await this.submenuVm.click();
        await expect(this.page).toHaveURL(/\/computes\/vms$/);
    }

    async openVmDetailByName(vmName) {
        const targetRow = this.tableRow.filter({ hasText: vmName }).first();
        await targetRow.locator(vmDetailLocator.moreActionButton).click();
        await this.viewDetailLink.click();
        await expect(this.page).toHaveURL(/\/computes\/vms\/organizations/);
    }

    async resizeRamAddOne() {
        await this.resizeTab.click();

        // 1. Wait for the RAM input field to become enabled (if VM is upgrading/processing)
        await expect(this.ramInput).toBeEnabled({ timeout: 30000 });

        // 2. Safely extract value and fill new value
        const currentRamVal = await this.ramInput.inputValue();
        const newRamVal = (parseInt(currentRamVal, 10) || 0) + 1;

        await this.ramInput.fill(newRamVal.toString());
        await this.updateButton.click();
        await this.confirmYesButton.click();

        await expect(this.updateButton).toBeDisabled({ timeout: 15000 });
    }

    async createSnapshotSchedule() {
        await this.snapshotTab.click();
        const scheduleCreateBtn = this.page
            .getByRole('button', { name: 'Create', exact: true })
            .filter({ hasNotText: 'Compute' })
            .first();
        await expect(scheduleCreateBtn).toBeEnabled({ timeout: 60000 });
        await scheduleCreateBtn.click();
        const modalDialog = this.page.locator('div[role="dialog"]');
        await expect(modalDialog).toBeVisible({ timeout: 10000 });

        const modalCreateBtn = modalDialog.getByRole('button', { name: 'Create', exact: true });
        await expect(modalCreateBtn).toBeEnabled({ timeout: 10000 });
        await modalCreateBtn.click();
        await expect(modalDialog).toBeHidden({ timeout: 30000 });
        await expect(this.page.locator('table').first()).toContainText('hourly');
    }

    async createBackupSchedule() {
        await this.backupTab.click();
        const backupTabPanel = this.page.getByRole('tabpanel', { name: 'Backups' });
        const createBackupScheduleBtn = backupTabPanel.getByRole('button', { name: 'Create', exact: true }).first();

        await expect(createBackupScheduleBtn).toBeVisible({ timeout: 15000 });
        await createBackupScheduleBtn.click();

        const modalDialog = this.page.getByRole('dialog').first();
        await expect(modalDialog).toBeVisible({ timeout: 10000 });

        const storageLocationDropdown = modalDialog.locator('[data-testid="dropdown-"]').nth(1);
        await storageLocationDropdown.click();
        await this.page.locator(vmDetailLocator.dropdownOption).first().click();

        const createBackupSubmitBtn = modalDialog.getByRole('button', { name: 'Create Backup', exact: true });
        await expect(createBackupSubmitBtn).toBeEnabled({ timeout: 10000 });
        await createBackupSubmitBtn.click();

        const successDialog = this.page.getByRole('dialog', { name: /Success/i });
        if (await successDialog.isVisible({ timeout: 5000 }).catch(() => false)) {
            await successDialog.getByRole('button').first().click();
        }
        await expect(successDialog).toBeHidden({ timeout: 10000 });
        await expect(backupTabPanel.locator('table').first()).toContainText('hourly');
    }
}