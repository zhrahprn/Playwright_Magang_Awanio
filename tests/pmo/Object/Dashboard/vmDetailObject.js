import { expect } from '@playwright/test';
import vmDetailLocator from '../../Locator/Dashboard/vmDetailLocator.js';

export default class VmDetailObject {
    constructor(page) {
        this.page = page;
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

    async openFirstVmDetail() {
        const firstRow = this.tableRow.first();
        await expect(firstRow).toBeVisible({ timeout: 20000 });

        const vmNameCell = firstRow.locator('td[data-testid="datatable-cell-Name"]').first();
        const extractedVmName = (await vmNameCell.textContent()).trim();

        await firstRow.locator(vmDetailLocator.moreActionButton).click();
        await this.viewDetailLink.click();
        await expect(this.page).toHaveURL(/\/computes\/vms\/organizations/);

        return extractedVmName;
    }

    async resizeRamAddOne() {
        await this.resizeTab.click();
        await expect(this.ramInput).toBeEnabled({ timeout: 30000 });

        const currentRamVal = await this.ramInput.inputValue();
        const newRamVal = (parseInt(currentRamVal, 10) || 0) + 1;

        await this.ramInput.fill(newRamVal.toString());
        await this.updateButton.click();
        await this.confirmYesButton.click();

        await expect(this.updateButton).toBeDisabled({ timeout: 15000 });
    }

    async createSnapshotSchedule() {
        await this.snapshotTab.click();
        const snapshotsTabPanel = this.page.getByRole('tabpanel', { name: 'Snapshots' });
        const scheduleCreateBtn = snapshotsTabPanel.getByRole('button', { name: 'Create', exact: true }).first();

        await expect(scheduleCreateBtn).toBeVisible({ timeout: 15000 });
        await expect(scheduleCreateBtn).toBeEnabled({ timeout: 15000 });
        await scheduleCreateBtn.click();
        const modalDialog = this.page.getByRole('dialog').first();
        await expect(modalDialog).toBeVisible({ timeout: 10000 });

        const modalSubmitBtn = modalDialog.getByRole('button', { name: /Create|Submit/i, exact: true }).first();
        await expect(modalSubmitBtn).toBeEnabled({ timeout: 10000 });
        await modalSubmitBtn.click();

        await expect(modalDialog).toBeHidden({ timeout: 30000 });
    }

    async createBackupSchedule() {
        await this.backupTab.click();

        const backupTabPanel = this.page.getByRole('tabpanel', { name: 'Backups' });
        const schedulesTable = backupTabPanel.locator('table').first();
        await expect(schedulesTable).toBeVisible({ timeout: 15000 });
        const existingScheduleRow = schedulesTable.getByRole('row', { name: /hourly|daily|weekly|monthly/i });
        if (await existingScheduleRow.isVisible()) {
            return;
        }

        const createBackupScheduleBtn = backupTabPanel.getByRole('button', { name: 'Create', exact: true }).first();
        await expect(createBackupScheduleBtn).toBeVisible({ timeout: 15000 });
        await expect(createBackupScheduleBtn).toBeEnabled({ timeout: 15000 });
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
        if (await successDialog.isVisible().catch(() => false)) {
            await successDialog.getByRole('button').first().click();
        }
        await expect(successDialog).toBeHidden({ timeout: 10000 });

        await expect(backupTabPanel.getByText(/hourly/i)).toBeVisible({ timeout: 15000 });
    }
}