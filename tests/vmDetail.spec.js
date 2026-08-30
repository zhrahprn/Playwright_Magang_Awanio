import { test } from '@playwright/test';
import LoginDemo from './pmo/Object/auth/loginDemo.js';
import VmDetailObject from './pmo/Object/Dashboard/vmDetailObject.js';

test('View Detail', async ({ page }) => {
  const objLogin = new LoginDemo(page);
  const objVmDetail = new VmDetailObject(page);

  await page.goto('https://platform.demo.awanio.com/');
  await objLogin.login('zahrah.purnama@gmail.com', 'Zz010904,');
  
  await objVmDetail.navigateToVmMenu();
  await objVmDetail.openVmDetailByName('testing-qa');
  await objVmDetail.resizeRamAddOne();
  await objVmDetail.createSnapshotSchedule();
  await objVmDetail.createBackupSchedule();
});