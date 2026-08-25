import { Page, Locator } from '@playwright/test';
import { CartPage } from './CartPage';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly txtQuantity: Locator;
    private readonly btnAddToCart: Locator;
    private readonly txtSuccessMessage: Locator;
    private readonly linkShoppingCart: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtQuantity = page.getByRole('textbox', { name: 'Qty' });
        this.btnAddToCart = page.getByRole('button', { name: 'Add to Cart' });
        this.txtSuccessMessage = page.locator('.alert-success');
        // Scoped to #top since the header "Shopping Cart" link is stable across every page
        this.linkShoppingCart = page.locator('#top').getByRole('link', { name: 'Shopping Cart' });
    }

    /**
     * Verifies the product details page is displayed for the given product.
     * @param productName - Expected product name
     * @returns Promise<boolean> - true if the product heading is visible
     */
    async isProductPageDisplayed(productName: string): Promise<boolean> {
        try {
            return await this.page.getByRole('heading', { name: productName, level: 1 }).isVisible();
        } catch (error) {
            console.log(`Error checking product page: ${error}`);
            return false;
        }
    }

    /**
     * Sets the desired quantity before adding the product to the cart.
     * @param quantity - Quantity to purchase
     */
    async setQuantity(quantity: string): Promise<void> {
        await this.txtQuantity.fill(quantity);
    }

    /**
     * Clicks "Add to Cart" and waits for the success confirmation message.
     */
    async addToCart(): Promise<void> {
        try {
            await this.btnAddToCart.click();
            await this.txtSuccessMessage.waitFor({ state: 'visible' });
        } catch (error) {
            console.log(`Error adding product to cart: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the "added to cart" success message is displayed.
     * @returns Promise<boolean> - true if the success message is shown
     */
    async isAddedToCartMessageDisplayed(): Promise<boolean> {
        try {
            return await this.txtSuccessMessage.isVisible();
        } catch (error) {
            console.log(`Error checking add-to-cart message: ${error}`);
            return false;
        }
    }

    /**
     * Opens the shopping cart via the header "Shopping Cart" link.
     * @returns Promise<CartPage> - Instance of the shopping cart page
     */
    async openShoppingCart(): Promise<CartPage> {
        await this.linkShoppingCart.click();
        return new CartPage(this.page);
    }
}
