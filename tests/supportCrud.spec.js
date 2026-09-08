import { test } from '@playwright/test';
import LoginDemo from './pmo/Object/auth/loginDemo.js'; // Sesuaikan path login Anda
import SupportPage from './pmo/Object/Dashboard/objectSupport.js';

test.describe.serial('Menu Support & Tickets Flow', () => {
  let loginPage;
  let supportPage;
  let createdTicketName = '';
  let createdCategoryName = '';

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginDemo(page);
    supportPage = new SupportPage(page);

    await loginPage.goto();
    await loginPage.login('zahrah.purnama@gmail.com', 'Zz010904,');
  });

  test('1. Create Ticket in Platform & Verify in Dash', async () => {
    createdTicketName = await supportPage.createTicketPlatform();
    await supportPage.verifyTicketOnDash(createdTicketName);
  });

  test('2. Update Ticket in Dash', async () => {
    await supportPage.updateTicketDash();
  });

  test('3. Create Category in Dash', async () => {
    createdCategoryName = await supportPage.createCategoryDash();
  });

  test('4. Delete Category in Dash', async () => {
    await supportPage.deleteCategoryDash();
  });
});