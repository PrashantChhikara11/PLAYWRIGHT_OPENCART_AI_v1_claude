/**
 * Test Case: Add Product to Cart
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Search for a known product and open its product details page
 * 2) Set the required quantity and add the product to the cart
 * 3) Verify the product-added confirmation message
 * 4) Open the shopping cart and verify the product and quantity
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Add product to cart test @master @sanity @regression @web', async ({ homePage, searchResultsPage, productPage, cartPage }) => {
    const { productName, productQuantity } = Helper.getProductDetails();

    await test.step('1) Search for the product and open its details page', async () => {
        await homePage.searchProduct(productName);
        await searchResultsPage.openProduct(productName);
        const isProductPageDisplayed = await productPage.isProductPageDisplayed(productName);
        expect(isProductPageDisplayed).toBeTruthy();
    });

    await test.step('2) Set the quantity and add the product to the cart', async () => {
        await productPage.setQuantity(productQuantity);
        await productPage.addToCart();
    });

    await test.step('3) Verify the product-added confirmation message', async () => {
        const isAddedMessageDisplayed = await productPage.isAddedToCartMessageDisplayed();
        expect(isAddedMessageDisplayed).toBeTruthy();
    });

    await test.step('4) Verify the product and quantity in the shopping cart', async () => {
        await productPage.openShoppingCart();
        const isProductInCart = await cartPage.isProductInCart(productName);
        expect(isProductInCart).toBeTruthy();

        const cartQuantity = await cartPage.getProductQuantity(productName);
        expect(cartQuantity).toBe(productQuantity);
    });

    console.log('✅ ✔️ Completed successfully!');
});
