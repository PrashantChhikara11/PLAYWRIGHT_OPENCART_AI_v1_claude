/**
 * Test Case: Invalid Login Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to My Account > Login
 * 2) Enter an invalid email and password
 * 3) Verify authentication fails with the expected warning message
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('Invalid login test @master @sanity @regression @web', async ({ homePage, loginPage }) => {
    const email = RandomDataUtil.getEmail();
    const password = RandomDataUtil.getPassword();

    await test.step('1) Navigate to the login page', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
    });

    await test.step('2) Login with invalid credentials', async () => {
        await loginPage.login(email, password);
    });

    await test.step('3) Verify the invalid login warning message', async () => {
        const isWarningDisplayed = await loginPage.isWarningMessageDisplayed();
        expect(isWarningDisplayed).toBeTruthy();

        const warningMessage = await loginPage.getWarningMessage();
        expect(warningMessage).toContain('Warning: No match for E-Mail Address and/or Password.');
    });

    console.log('✅ ✔️ Completed successfully!');
});
