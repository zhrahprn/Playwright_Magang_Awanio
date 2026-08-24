import { expect } from '@playwright/test';
import locatorProject from '../../Locator/Dashboard/locatorProject.js';

export class ProjectPage {
  constructor(page) {
    this.page = page;
    this.tenancyMenu = page.locator(locatorProject.tenancyMenu);
    this.projectMenu = page.getByTestId(locatorProject.projectMenu);
    this.createProjectBtn = page.locator(locatorProject.createProjectBtn);
    this.moreActionTrigger = page.getByTestId(locatorProject.moreActionTrigger);
    this.viewUpdateLink = page.locator(locatorProject.viewUpdateLink);

    this.actionMenu = page.getByRole('dialog').filter({ hasText: /Update|Remove/i });

    this.updateModal = page.getByRole('dialog').filter({ hasText: /Update/i });
    this.projectNameInput = this.updateModal.getByRole('textbox');
    this.submitBtn = this.updateModal.getByRole('button', { name: 'Update', exact: true });

    this.removeOption = page.locator(locatorProject.removeOption);

    this.deleteModal = page.getByRole('dialog').filter({ hasText: /remove|delete/i });
    this.deleteConfirmInput = this.deleteModal.getByRole('textbox'); // Ambil input textbox dalam modal delete
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

    await this.page.getByRole('textbox').fill(projectName);
    await this.page.getByTestId('create-button').click();

    await this.page.waitForURL('**/projects', { waitUntil: 'domcontentloaded' });
    await this.verifyProjectVisible(projectName);
  }

  async updateProject(updatedName) {
    await this.navigateToProject();

    await this.moreActionTrigger.first().click();
    await this.viewUpdateLink.click();
    await this.page.waitForURL('**/projects/*', { waitUntil: 'domcontentloaded' });

    await this.moreActionTrigger.first().click();
    await this.actionMenu.getByText('Update', { exact: true }).click();

    await expect(this.updateModal).toBeVisible();
    await this.projectNameInput.clear();
    await this.projectNameInput.fill(updatedName);
    await this.submitBtn.click();

    await this.navigateToProject();
    await this.verifyProjectVisible(updatedName);
  }

  async verifyProjectVisible(projectName) {
    await expect(this.page.getByRole('link', { name: projectName, exact: true })).toBeVisible();
  }

  async verifyProjectNotVisible(projectName) {
    await expect(this.page.getByRole('link', { name: projectName, exact: true })).not.toBeVisible();
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