import { test } from '@playwright/test';
import LoginDemo from '../tests/pmo/Object/auth/loginDemo'; 
import objectDemo from '../tests/pmo/Object/Dashboard/objectDemo'; 

test.describe.serial('VM Creation Flow', () => {
    let loginPage;
    let vmPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginDemo(page);
        vmPage = new objectDemo(page);

        // Menjalankan alur login sebelum pengujian
        await loginPage.goto();
        await loginPage.login('zahrah.purnama@gmail.com', 'Zz010904,');
    });

    test('2. Create VM Test', async () => {
        await vmPage.navigateToCreateVM();
        await vmPage.selectDistributionUbuntu();
        await vmPage.selectCpuPreference('x86_64', 'Intel');
        await vmPage.selectPlanSa();
        await vmPage.fillAuthentication('ubuntu', 'Zz010904,');
        await vmPage.fillVMDetails('vm-test-auto', 'VM Automated Test');
        await vmPage.submitCreateVM();
    });
});