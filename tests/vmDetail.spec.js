import { test } from '@playwright/test';
import LoginDemo from './pmo/Object/auth/loginDemo.js';
import VmDetailObject from './pmo/Object/Dashboard/vmDetailObject.js';

test.describe.serial('VM Operations Flow', () => {
    let page;
    let objVmDetail;
    let selectedVmName = ''; 
    
    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        const objLogin = new LoginDemo(page);
        objVmDetail = new VmDetailObject(page);

        await page.goto('https://platform.demo.awanio.com/');


        await page.context().clearCookies();
        await page.evaluate(() => {
            window.localStorage.clear();
            window.sessionStorage.clear();
        }).catch(() => {});

        await objLogin.login('zahrah.purnama@gmail.com', 'Zz010904,');
        
        await objVmDetail.navigateToVmMenu();
        

        selectedVmName = await objVmDetail.openFirstVmDetail();
        console.log(`Menjalankan pengujian untuk VM: ${selectedVmName}`);
    });

    test.afterAll(async () => {
        await page.close();
    });

    test('1. Resize VM RAM', async () => {
        await objVmDetail.resizeRamAddOne();
    });

    test('2. Create Snapshot Schedule', async () => {
        await objVmDetail.createSnapshotSchedule();
    });

    test('3. Create Backup Schedule', async () => {
        await objVmDetail.createBackupSchedule();
    });
});