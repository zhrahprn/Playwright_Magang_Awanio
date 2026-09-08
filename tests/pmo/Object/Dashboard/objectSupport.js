import { expect } from '@playwright/test';
import locatorSupport from '../../Locator/Dashboard/locatorSupport.js';
import LoginDashboard from '../auth/loginDashboard.js';

export default class SupportPage {
  constructor(page) {
    this.page = page;
    this.supportMenu = page.getByTestId(locatorSupport.supportMenu);
    this.accordionSupportMenu = page.getByTestId(locatorSupport.accordionSupportMenu);
    this.ticketSubmenu = page.getByTestId(locatorSupport.ticketSubmenu);
    this.categorySubmenu = page.getByTestId(locatorSupport.categorySubmenu);
    
    this.createOptionBtn = page.getByTestId(locatorSupport.createOptionBtn);
    this.moreActionTrigger = page.getByTestId(locatorSupport.moreActionTrigger);
    
    this.subjectInput = page.locator('textarea').first();
    this.issueDescriptionInput = page.locator('textarea').nth(1);
    this.submitBtn = page.getByRole('button', { name: 'Submit', exact: true });
    
    this.categoryNameInput = page.getByTestId('input-name');
    this.categorySubmitBtn = page.getByTestId('button-submit');

    this.deleteConfirmInput = page.locator('input[data-testid="input-delete-confirm"]');
    this.deleteSubmitBtn = page.getByTestId('button-submit-delete');
  }

  async generateDynamicName(prefix = 'testing-qa') {
    const numberWords = ['satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh'];
    await this.page.waitForLoadState('domcontentloaded');
    
    const elements = this.page.locator('table span, table a, main span, main a');
    const existingTexts = await elements.allInnerTexts();
    
    for (let i = 0; i < numberWords.length; i++) {
      const targetName = `${prefix}-${numberWords[i]}`;
      const isExist = existingTexts.some(text => text.trim() === targetName);
      if (!isExist) {
        return targetName;
      }
    }
    return `${prefix}-${Date.now()}`;
  }

  async createTicketPlatform() {
    await this.supportMenu.click();
    await this.page.waitForURL('**/support', { waitUntil: 'domcontentloaded' });

    await this.createOptionBtn.click();
    await this.page.waitForURL('**/support/create', { waitUntil: 'domcontentloaded' });

    const ticketName = await this.generateDynamicName('testing-qa');
    await this.subjectInput.fill(ticketName);
    
    const priorityDropdown = this.page.locator('div').filter({ hasText: /^Priority Level/ }).locator('div.relative, [role="combobox"], input, div[class*="border"]').last();
    await priorityDropdown.click();
    
    const priorityOptions = this.page.locator('[data-testid^="dropdown-listbox-text-"]');
    const priorityCount = await priorityOptions.count();
    if (priorityCount > 0) {
      await priorityOptions.nth(0).click(); 
    }

    await this.issueDescriptionInput.fill('Automation testing issue description');
    const categoryDropdown = this.page.locator('div').filter({ hasText: /^Category/ }).locator('div.relative, [role="combobox"], input, div[class*="border"]').last();
    await categoryDropdown.click();

    await this.page.getByTestId('dropdown-searcher-input').fill('vm');
    const categoryOptions = this.page.getByTestId('dropdown-listbox-text-0');
    await categoryOptions.click();

    await this.submitBtn.click();
    await this.page.waitForURL('**/support', { waitUntil: 'domcontentloaded' });

    await expect(this.page.locator('table').getByText(ticketName).first()).toBeVisible();
    return ticketName;
  }

  async verifyTicketOnDash(ticketName) {
    const dashLogin = new LoginDashboard(this.page);
    await dashLogin.goto();
    await dashLogin.login('zahrah.purnama@gmail.com', 'Zz010904,');

    await this.page.goto('https://dash.demo.awanio.com/support/ticket', { waitUntil: 'domcontentloaded' });

    await expect(this.page.locator('table').getByText(ticketName).first()).toBeVisible();
  }

  async updateTicketDash() {
    const dashLogin = new LoginDashboard(this.page);
    await dashLogin.goto();
    await dashLogin.login('zahrah.purnama@gmail.com', 'Zz010904,');

    await this.page.goto('https://dash.demo.awanio.com/support/ticket', { waitUntil: 'domcontentloaded' });

    await this.moreActionTrigger.first().click();
    await this.page.getByTestId('label-update-ticket').click();

    await this.page.getByTestId('dropdown-priority-level').click();
    await this.page.getByTestId('dropdown-listbox-option-1').click();

    await this.submitBtn.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async createCategoryDash() {
    const dashLogin = new LoginDashboard(this.page);
    await dashLogin.goto();
    await dashLogin.login('zahrah.purnama@gmail.com', 'Zz010904,');

    await this.page.goto('https://dash.demo.awanio.com/support/category', { waitUntil: 'domcontentloaded' });

    await this.createOptionBtn.click();
    
    const categoryName = await this.generateDynamicName('testing-qa');
    await this.categoryNameInput.fill(categoryName);
    await this.categorySubmitBtn.click();

    await this.page.waitForURL('**/support/category', { waitUntil: 'domcontentloaded' });
    await expect(this.page.locator('table').getByText(categoryName).first()).toBeVisible();
    
    return categoryName;
  }

  async deleteCategoryDash() {
    const dashLogin = new LoginDashboard(this.page);
    await dashLogin.goto();
    await dashLogin.login('zahrah.purnama@gmail.com', 'Zz010904,');

    await this.page.goto('https://dash.demo.awanio.com/support/category', { waitUntil: 'domcontentloaded' });

    const categoryCell = this.page.getByTestId('datatable-cell-Name').first();
    const categoryName = (await categoryCell.textContent()).trim();

    await this.moreActionTrigger.first().click();
    await this.page.getByTestId('button-delete').click();

    await this.deleteConfirmInput.fill(categoryName);
    await this.deleteSubmitBtn.click();
    
    await expect(this.page.getByText(categoryName)).not.toBeVisible();
  }
}