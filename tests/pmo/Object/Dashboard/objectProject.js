import { expect } from '@playwright/test';
import locatorProject from '../../Locator/Dashboard/locatorProject.js';

export default class ProjectPage {
  constructor(page) {
    this.page = page;
    this.tenancyMenu = page.getByTestId(locatorProject.tenancyMenu);
    this.projectMenu = page.getByTestId(locatorProject.projectMenu);
    this.createProjectBtn = page.getByTestId(locatorProject.createProjectBtn);
    this.createFormSubmitBtn = page.getByTestId(locatorProject.createFormSubmitBtn);
    this.moreActionTrigger = page.getByTestId(locatorProject.moreActionTrigger);
    this.viewUpdateLink = page.getByTestId(locatorProject.viewUpdateLink);
    this.removeOption = page.getByTestId(locatorProject.removeOption);
    this.projectNameInput = page.getByTestId(locatorProject.projectNameInput);
    this.deleteModal = page.getByRole('dialog');
    this.deleteProjectNameLabel = page.locator('span.font-medium.text-primary').first();
    this.deleteConfirmInput = page.locator('input.text-black-default').last();
    this.deleteSubmitBtn = page.getByRole('button', { name: 'Delete', exact: true });
  }

  async navigateToProject() {
    if (!(await this.projectMenu.isVisible())) {
      await this.tenancyMenu.click();
    }
    await this.projectMenu.click();
    await this.page.waitForURL('**/projects', { waitUntil: 'domcontentloaded' });
  }

  async generateDynamicProjectName(prefix = 'testing-qa') {
    const numberWords = ['satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh'];
    await this.page.waitForLoadState('domcontentloaded');
    const projectElements = this.page.locator('main span.font-medium.text-primary, main a[href*="/projects/"]');
    const existingTexts = await projectElements.allInnerTexts();
    for (let i = 0; i < numberWords.length; i++) {
      const targetName = `${prefix}-${numberWords[i]}`;
      const isExist = existingTexts.some(text => text.trim() === targetName);

      if (!isExist) {
        return targetName; 
      }
    }

    return `${prefix}-${Date.now()}`;
  }

  async createProject() {
    await this.navigateToProject();
    const projectName = await this.generateDynamicProjectName('testing-qa');

    await this.createProjectBtn.click();
    await this.page.waitForURL('**/projects/create', { waitUntil: 'domcontentloaded' });

    await this.projectNameInput.fill(projectName);
    await this.createFormSubmitBtn.click();

    await this.page.waitForURL('**/projects', { waitUntil: 'domcontentloaded' });
    await this.verifyProjectVisible(projectName);

    return projectName;
  }

  async updateProject() {
    await this.navigateToProject();

    // 1. Ambil nama project pertama di list
    const firstProjectLink = this.page.locator('main span.font-medium.text-primary, main a[href*="/projects/"]').first();
    await firstProjectLink.waitFor({ state: 'visible' });
    const currentName = (await firstProjectLink.textContent()).trim();
    const updatedName = `${currentName}-updated`;

    // 2. Masuk ke halaman detail project
    await this.moreActionTrigger.first().click();
    await this.viewUpdateLink.click();
    await this.page.waitForURL('**/projects/*', { waitUntil: 'domcontentloaded' });
    await this.moreActionTrigger.first().click();
    await this.page.locator('div[role="dialog"]').getByText('Update', { exact: true }).click();
    await this.projectNameInput.fill(updatedName);
    await this.createFormSubmitBtn.click();
    await expect(this.page.getByText(updatedName)).toBeVisible();
    return updatedName;
  }

  async deleteProject() {
    await this.navigateToProject();

    await this.moreActionTrigger.first().click();
    await this.removeOption.click();
    await expect(this.deleteModal).toBeVisible();

    await this.deleteProjectNameLabel.waitFor({ state: 'visible' });
    const extractedProjectName = await this.deleteProjectNameLabel.textContent();
    const cleanProjectName = extractedProjectName ? extractedProjectName.trim() : '';

    await this.deleteConfirmInput.focus();
    await this.deleteConfirmInput.clear();
    await this.deleteConfirmInput.pressSequentially(cleanProjectName, { delay: 50 });

    await expect(this.deleteSubmitBtn).toBeEnabled();
    await this.deleteSubmitBtn.click();

    await expect(this.deleteModal).toBeHidden();
    return cleanProjectName;
  }

  async verifyProjectVisible(projectName) {
    await expect(this.page.getByRole('link', { name: projectName, exact: true })).toBeVisible();
  }

  async verifyProjectNotVisible(projectName) {
    await expect(this.page.getByRole('link', { name: projectName, exact: true })).not.toBeVisible();
  }
}