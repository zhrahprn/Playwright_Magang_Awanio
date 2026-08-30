import { test } from '@playwright/test';
import LoginDemo from './pmo/Object/auth/loginDemo.js';
import ObjectDemo from './pmo/Object/Dashboard/objectDemo.js';

test('Create VM', async ({ page }) => {
  const objLogin = new LoginDemo(page);
  const objVm = new ObjectDemo(page);

  await page.goto('https://platform.demo.awanio.com/');

  await objLogin.login('zahrah.purnama@gmail.com', 'Zz010904,');
  

  await objVm.computeMenu.click();
  await objVm.submenuVm.click();
  await objVm.createVmButton.click();
  await objVm.selectOsImage();
  await objVm.selectCpuPreferences();
  await objVm.fillVmDetails({
    username: 'testing-qa-automation',
    password: 'Password123!',
    hostname: 'testing-qa-automation',
    vmName: 'testing-qa-automation',
  });

  await objVm.submitCreateVm('testing-qa');
});