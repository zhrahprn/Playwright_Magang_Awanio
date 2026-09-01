import { test } from '@playwright/test';
import LoginDemo from './pmo/Object/auth/loginDemo.js';
import ProjectPage from './pmo/Object/Dashboard/objectProject.js';

test.describe.serial('CRUD Project Tenancy Flow', () => {
  let loginPage;
  let projectPage;
  let createdProjectName = '';

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginDemo(page);
    projectPage = new ProjectPage(page);

    await loginPage.goto();
    await loginPage.login('zahrah.purnama@gmail.com', 'Zz010904,');
  });

  test('1. Create Project', async () => {
    createdProjectName = await projectPage.createProject();
  });

  test('2. Update Project', async () => {
    await projectPage.updateProject();
  });

  test('3. Delete Project', async () => {
    const deletedName = await projectPage.deleteProject();
    await projectPage.verifyProjectNotVisible(deletedName);
  });
});