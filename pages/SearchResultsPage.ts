import { Page, Locator } from '@playwright/test';
import { ProductPage } from './ProductPage';

export class SearchResultsPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Returns the exact-match product link locator for the given product name.
     * Search results render both a thumbnail image link and a text link per product,
     * so the locator may match more than one element for the same product.
     */
    private productLink(productName: string): Locator {
        return this.page.getByRole('link', { name: productName, exact: true });
    }

    /**
     * Verifies the given product is shown in the search results.
     * @param productName - Expected product name
     * @returns Promise<boolean> - true if the product is displayed
     */
    async isProductDisplayed(productName: string): Promise<boolean> {
        try {
            return await this.productLink(productName).first().isVisible();
        } catch (error) {
            console.log(`Error checking search results: ${error}`);
            return false;
        }
    }

    /**
     * Opens the product details page for the given product name.
     * @param productName - Product name to open
     * @returns Promise<ProductPage> - Instance of the product details page
     */
    async openProduct(productName: string): Promise<ProductPage> {
        await this.productLink(productName).first().click();
        return new ProductPage(this.page);
    }
}
