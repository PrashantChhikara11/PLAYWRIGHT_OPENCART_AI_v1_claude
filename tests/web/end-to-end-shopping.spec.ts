/**
 * Test Case: End-to-End Shopping Flow
 *
 * Tags: @master @regression @end-to-end @web
 *
 * Steps:
 * 1) Register a new customer using dynamically generated unique data
 * 2) Logout, then login again using the newly created credentials
 * 3) Search for a known product and add it to the cart
 * 4) Verify the product, quantity, price, and cart total
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';

test('End-to-end shopping test @master @regression @end-to-end @web', async ({
    homePage,
    registerPage,
    myAccountPage,
    logoutPage,
    loginPage,
    searchResultsPage,
    productPage,
    cartPage,
}) => {
    const userData = {
        firstName: RandomDataUtil.getFirstName(),
        lastName: RandomDataUtil.getLastName(),
        email: RandomDataUtil.getEmail(),
        telephone: RandomDataUtil.getPhoneNumber(),
        password: RandomDataUtil.getPassword(),
    };
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

    await test.step('1) Register a new customer', async () => {
        await homePage.clickMyAccount();
        await homePage.clickRegister();
        await registerPage.register(userData);
        const isSuccessful = await registerPage.isRegistrationSuccessful();
        expect(isSuccessful).toBeTruthy();
        await registerPage.clickContinueToMyAccount();
    });

    await test.step('2) Logout and login again with the new credentials', async () => {
        await myAccountPage.clickLogout();
        await logoutPage.clickContinue();

        await homePage.clickMyAccount();
        await homePage.clickLogin();
        await loginPage.login(userData.email, userData.password);
        const isLoggedIn = await myAccountPage.isMyAccountPageExists();
        expect(isLoggedIn).toBeTruthy();
    });

    await test.step('3) Search for the product and add it to the cart', async () => {
        await homePage.searchProduct(productName);
        await searchResultsPage.openProduct(productName);
        await productPage.setQuantity(productQuantity);
        await productPage.addToCart();
        const isAddedMessageDisplayed = await productPage.isAddedToCartMessageDisplayed();
        expect(isAddedMessageDisplayed).toBeTruthy();
    });

    await test.step('4) Verify the product, quantity, price, and cart total', async () => {
        await productPage.openShoppingCart();

        const isProductInCart = await cartPage.isProductInCart(productName);
        expect(isProductInCart).toBeTruthy();

        const cartQuantity = await cartPage.getProductQuantity(productName);
        expect(cartQuantity).toBe(productQuantity);

        const unitPrice = await cartPage.getProductUnitPrice(productName);
        expect(unitPrice).toBe(totalPrice);

        const cartTotal = await cartPage.getCartTotal();
        expect(cartTotal).toBe(totalPrice);
    });

    console.log('✅ ✔️ Completed successfully!');
});
