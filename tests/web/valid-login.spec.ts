/**
 * Test Case: Valid Login Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to My Account > Login
 * 2) Enter valid customer credentials from the project's configured test data
 * 3) Verify successful authentication and redirect to My Account
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Valid login test @master @sanity @regression @web', async ({ homePage, loginPage, myAccountPage }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Navigate to the login page', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
    });

    await test.step('2) Login with valid credentials', async () => {
        await loginPage.login(email, password);
    });

    await test.step('3) Verify the My Account page is displayed', async () => {
        const isLoggedIn = await myAccountPage.isMyAccountPageExists();
        expect(isLoggedIn).toBeTruthy();
    });

    console.log('✅ ✔️ Completed successfully!');
});
