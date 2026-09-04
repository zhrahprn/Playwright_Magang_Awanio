import { test } from '@playwright/test';
import loginDashboard from './pmo/Object/auth/loginDashboard.js';
import UserPage from './pmo/Object/Dashboard/objectUser.js';

test.describe.serial('CRUD User Management', () => {
  let loginPage;
  let userPage;

  test.beforeEach(async ({ page }) => {
    
    loginPage = new loginDashboard(page); 
    userPage = new UserPage(page);

    await loginPage.goto();
    await loginPage.login('zahrah.purnama@gmail.com', 'Zz010904,');
  });

  test('1. Create User', async () => {
    await userPage.createUser();
  });

  test('2. Update User', async () => {
    await userPage.updateUser();
  });

  test('3. Delete User', async () => {
    const deletedName = await userPage.deleteUser();
    await userPage.verifyUserNotVisible(deletedName);
  });
});