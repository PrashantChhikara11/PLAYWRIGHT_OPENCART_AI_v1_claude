import { Page, Locator } from '@playwright/test';

export class CartPage {
    private readonly page: Page;

    // Locators
    private readonly cartTable: Locator;
    private readonly totalRow: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        // The cart table is identified by its "Quantity" column, which distinguishes it from
        // the header mini-cart preview table and the order-totals table on the same page.
        this.cartTable = page.getByRole('table').filter({ has: page.getByRole('cell', { name: 'Quantity', exact: true }) });
        // "Total:" filtered exact to avoid matching the "Sub-Total:" row
        this.totalRow = page.getByRole('row').filter({ has: page.getByRole('cell', { name: 'Total:', exact: true }) });
    }

    /**
     * Returns the cart table row for the given product name.
     */
    private productRow(productName: string): Locator {
        return this.cartTable
            .getByRole('row')
            .filter({ has: this.page.getByRole('link', { name: productName, exact: true }) });
    }

    /**
     * Verifies the given product is present in the cart.
     * @param productName - Expected product name
     * @returns Promise<boolean> - true if the product row is visible
     */
    async isProductInCart(productName: string): Promise<boolean> {
        try {
            return await this.productRow(productName).isVisible();
        } catch (error) {
            console.log(`Error checking cart contents: ${error}`);
            return false;
        }
    }

    /**
     * Returns the quantity displayed for the given product in the cart.
     * @param productName - Product name
     * @returns Promise<string> - Quantity value
     */
    async getProductQuantity(productName: string): Promise<string> {
        return await this.productRow(productName).getByRole('textbox').inputValue();
    }

    /**
     * Returns the unit price displayed for the given product in the cart.
     * @param productName - Product name
     * @returns Promise<string> - Unit price text (e.g. "$602.00")
     */
    async getProductUnitPrice(productName: string): Promise<string> {
        const cells = this.productRow(productName).getByRole('cell');
        return ((await cells.nth(4).textContent()) ?? '').trim();
    }

    /**
     * Returns the cart grand total.
     * @returns Promise<string> - Total text (e.g. "$602.00")
     */
    async getCartTotal(): Promise<string> {
        return ((await this.totalRow.getByRole('cell').last().textContent()) ?? '').trim();
    }
}
