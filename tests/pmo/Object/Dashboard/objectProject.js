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
    this.deleteConfirmInput = this.deleteModal.locator('input[type="text"]');
    this.deleteSubmitBtn = this.deleteModal.getByRole('button', { name: 'Delete', exact: true });
  }

  async navigateToProject() {
    if (!(await this.projectMenu.isVisible())) {
      await this.tenancyMenu.click();
    }
    await this.projectMenu.click();
    await this.page.waitForURL('**/projects', { waitUntil: 'domcontentloaded' });
  }

  async createProject(projectName) {
    await this.navigateToProject();
    await this.createProjectBtn.click();
    await this.page.waitForURL('**/projects/create', { waitUntil: 'domcontentloaded' });

    await this.projectNameInput.fill(projectName);
    await this.createFormSubmitBtn.click();

    await this.page.waitForURL('**/projects', { waitUntil: 'domcontentloaded' });
    await this.verifyProjectVisible(projectName);
  }

  async updateProject(updatedName) {
    await this.navigateToProject();
    await this.moreActionTrigger.first().click();
    await this.viewUpdateLink.click();
    await this.page.waitForURL('**/projects/*', { waitUntil: 'domcontentloaded' });
    await this.moreActionTrigger.first().click();
    await this.page.getByText('Update', { exact: true }).click();
    await this.projectNameInput.clear();
    await this.projectNameInput.fill(updatedName);
    await this.createFormSubmitBtn.click();

    await this.navigateToProject();
    await this.verifyProjectVisible(updatedName);
  }
  
  async deleteProject(projectName) {
    await this.navigateToProject();
    await this.moreActionTrigger.first().click();
    await this.removeOption.click();
    await expect(this.deleteModal).toBeVisible();
    await this.deleteConfirmInput.fill(projectName);

    await expect(this.deleteSubmitBtn).toBeEnabled();
    await this.deleteSubmitBtn.click();

    await expect(this.deleteModal).toBeHidden();

    await this.verifyProjectNotVisible(projectName);
  }

  async verifyProjectVisible(projectName) {
    await expect(this.page.getByRole('link', { name: projectName, exact: true })).toBeVisible();
  }

  async verifyProjectNotVisible(projectName) {
    await expect(this.page.getByRole('link', { name: projectName, exact: true })).not.toBeVisible();
  }
}