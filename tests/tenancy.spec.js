import { test } from '@playwright/test';
import LoginDemo from './pmo/Object/auth/loginDemo.js';
import ProjectPage from './pmo/Object/Dashboard/objectProject.js';

test.describe.serial('CRUD Project Tenancy Flow', () => {
  let loginPage;
  let projectPage;

  const initialProjectName = 'automated-test-project';
  const updatedProjectName = 'automated-test-project-updated';

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginDemo(page);
    projectPage = new ProjectPage(page);

    await loginPage.goto();
    await loginPage.login('zahrah.purnama@gmail.com', 'Zz010904,');
    await projectPage.navigateToProject();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('1. Create Project', async () => {
    await projectPage.createProject(initialProjectName);
    await projectPage.verifyProjectVisible(initialProjectName);
  });

  test('2. Update Project', async () => {
    await projectPage.updateProject(updatedProjectName);
    await projectPage.verifyProjectVisible(updatedProjectName);
  });

  test('3. Delete Project', async () => {
    await projectPage.deleteProject(updatedProjectName);
    await projectPage.verifyProjectNotVisible(updatedProjectName);
  });
});