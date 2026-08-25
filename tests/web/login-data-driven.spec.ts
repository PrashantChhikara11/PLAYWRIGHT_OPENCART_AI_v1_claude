/**
 * Test Case: Login Flow (Data Driven using External File)
 *
 * Tags: @master @regression @datadriven @web
 *
 * Steps:
 * 1) Load login test data rows from testdata/opencart_logindata.json
 * 2) For each row, enter the email/password (leaving blank values empty) and submit
 * 3) Verify the result matches the row's expected outcome
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';

interface LoginDataRow {
    testName: string;
    email: string;
    password: string;
    expected: 'success' | 'failure';
}

const loginData: LoginDataRow[] = DataProvider.readJson('./testdata/opencart_logindata.json');

loginData.forEach((row, index) => {
    test(`Data driven login #${index + 1} - ${row.testName} (${row.expected}) @master @regression @datadriven @web`, async ({
        homePage,
        loginPage,
        myAccountPage,
    }) => {
        await test.step('1) Navigate to the login page', async () => {
            await homePage.clickMyAccount();
            await homePage.clickLogin();
        });

        await test.step('2) Submit the login form with the data row', async () => {
            await loginPage.login(row.email, row.password);
        });

        await test.step(`3) Verify the ${row.expected} result`, async () => {
            if (row.expected === 'success') {
                const isLoggedIn = await myAccountPage.isMyAccountPageExists();
                expect(isLoggedIn).toBeTruthy();
            } else {
                const isWarningDisplayed = await loginPage.isWarningMessageDisplayed();
                expect(isWarningDisplayed).toBeTruthy();
            }
        });

        console.log('✅ ✔️ Completed successfully!');
    });
});
