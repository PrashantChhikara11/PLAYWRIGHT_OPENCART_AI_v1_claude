/**
 * Test Case: Product Search Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Search for a known product using the header search field
 * 2) Verify the search results page displays the expected product
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Product search test @master @sanity @regression @web', async ({ homePage, searchResultsPage }) => {
    const { productName } = Helper.getProductDetails();

    await test.step('1) Search for the product', async () => {
        await homePage.searchProduct(productName);
    });

    await test.step('2) Verify the product appears in the search results', async () => {
        const isProductDisplayed = await searchResultsPage.isProductDisplayed(productName);
        expect(isProductDisplayed).toBeTruthy();
    });

    console.log('✅ ✔️ Completed successfully!');
});
