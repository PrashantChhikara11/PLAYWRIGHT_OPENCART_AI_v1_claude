/**
 * Test Case: User Registration Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to My Account > Register
 * 2) Register a new customer with unique generated data
 * 3) Verify the account-created confirmation is displayed
 * 4) Verify the new account is reachable via My Account navigation
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('User registration test @master @sanity @regression @web', async ({ homePage, registerPage, myAccountPage }) => {
    const userData = {
        firstName: RandomDataUtil.getFirstName(),
        lastName: RandomDataUtil.getLastName(),
        email: RandomDataUtil.getEmail(),
        telephone: RandomDataUtil.getPhoneNumber(),
        password: RandomDataUtil.getPassword(),
    };

    await test.step('1) Navigate to the registration page', async () => {
        await homePage.clickMyAccount();
        await homePage.clickRegister();
    });

    await test.step('2) Register a new customer', async () => {
        await registerPage.register(userData);
    });

    await test.step('3) Verify the registration success message', async () => {
        const isSuccessful = await registerPage.isRegistrationSuccessful();
        expect(isSuccessful).toBeTruthy();
    });

    await test.step('4) Verify the account is reachable via My Account navigation', async () => {
        await registerPage.clickContinueToMyAccount();
        const isMyAccountDisplayed = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountDisplayed).toBeTruthy();
    });

    console.log('✅ ✔️ Completed successfully!');
});
