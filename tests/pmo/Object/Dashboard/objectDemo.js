import { expect } from '@playwright/test';
import locatorDemo from '../../Locator/Dashboard/locatorDemo.js';

export default class ObjectDemo {
  constructor(page) {
    this.page = page;

    this.computeMenu = page.locator(locatorDemo.computeMenu);
    this.submenuVm = page.locator(locatorDemo.submenuVm);
    this.createVmButton = page.locator(locatorDemo.createVmButton);
    this.seeAllDistributionButton = page.locator(locatorDemo.seeAllDistributionButton);
    this.chooseButton = page.locator(locatorDemo.chooseButton);
    this.cpuArchitectureDropdown = page.locator(locatorDemo.cpuDropdown).nth(0);
    this.optionX86_64 = page.locator(locatorDemo.optionX86_64);
    this.cpuProcessorDropdown = page.locator(locatorDemo.cpuDropdown).nth(1);
    this.optionIntel = page.locator(locatorDemo.optionIntel);
    this.authUsernameInput = page.locator(locatorDemo.authUsernameInput);
    this.authPasswordInput = page.locator(locatorDemo.authPasswordInput);
    this.hostnameInput = page.locator(locatorDemo.hostnameInput).first();
    this.nameInput = page.locator(locatorDemo.nameInput).nth(1);
    this.submitButton = page.locator(locatorDemo.submitButton).last();
    this.tableRow = page.locator(locatorDemo.tableRow);
  }

  async selectOsImage() {
    await this.seeAllDistributionButton.click();

    const ubuntuRow = this.page.locator('tr', { hasText: 'Ubuntu' });
    await ubuntuRow.locator('input[type="radio"], label').first().click({ force: true }).catch(async () => {
      await ubuntuRow.click();
    });

    const ubuntuDropdown = ubuntuRow.locator('[data-testid="dropdown-"]');
    await ubuntuDropdown.click();
    await this.page.locator(locatorDemo.dropdownOption).first().click();

    await this.chooseButton.click();
  }

  async selectCpuPreferences() {
    await this.cpuArchitectureDropdown.click();
    await this.optionX86_64.click();
    await this.cpuProcessorDropdown.click();
    await this.optionIntel.click();
  }

  async fillVmDetails({ username, password, hostname, vmName }) {
    await this.authUsernameInput.fill(username);
    await this.authPasswordInput.fill(password);
    await this.hostnameInput.fill(hostname);
    await this.nameInput.fill(vmName);
  }

  async submitCreateVm(vmName) {
    await this.submitButton.click();
    await expect(this.page).toHaveURL(/\/computes\/vms$/);
    await expect(this.tableRow.filter({ hasText: vmName }).first()).toBeVisible({ timeout: 15000 });
  }
}