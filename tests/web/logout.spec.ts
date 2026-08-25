/**
 * Test Case: Logout Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Login with valid customer credentials
 * 2) Logout from the account
 * 3) Verify the logout confirmation page and redirect to the homepage
 * 4) Verify authenticated account options are no longer available
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Logout test @master @sanity @regression @web', async ({ homePage, loginPage, myAccountPage, logoutPage }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Login with valid credentials', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        await loginPage.login(email, password);
        const isLoggedIn = await myAccountPage.isMyAccountPageExists();
        expect(isLoggedIn).toBeTruthy();
    });

    await test.step('2) Logout from the account', async () => {
        await myAccountPage.clickLogout();
    });

    await test.step('3) Verify the logout confirmation page', async () => {
        const isLogoutPageDisplayed = await logoutPage.isLogoutPageExists();
        expect(isLogoutPageDisplayed).toBeTruthy();
        await logoutPage.clickContinue();
    });

    await test.step('4) Verify authenticated account options are no longer available', async () => {
        await homePage.clickMyAccount();
        const isGuestMenuDisplayed = await homePage.isGuestMenuDisplayed();
        expect(isGuestMenuDisplayed).toBeTruthy();
    });

    console.log('✅ ✔️ Completed successfully!');
});
