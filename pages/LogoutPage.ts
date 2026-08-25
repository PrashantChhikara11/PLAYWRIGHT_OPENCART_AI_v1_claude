import { Page, Locator } from '@playwright/test';
import { HomePage } from './HomePage';

export class LogoutPage {
    private readonly page: Page;

    // Locators
    private readonly headingAccountLogout: Locator;
    private readonly linkContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingAccountLogout = page.getByRole('heading', { name: 'Account Logout' });
        this.linkContinue = page.getByRole('link', { name: 'Continue' });
    }

    /**
     * Verifies the logout confirmation page is displayed.
     * @returns Promise<boolean> - true if the Account Logout heading is visible
     */
    async isLogoutPageExists(): Promise<boolean> {
        try {
            return await this.headingAccountLogout.isVisible();
        } catch (error) {
            console.log(`Error checking logout page: ${error}`);
            return false;
        }
    }

    /**
     * Clicks "Continue" to return to the homepage.
     * @returns Promise<HomePage> - Instance of the home page
     */
    async clickContinue(): Promise<HomePage> {
        await this.linkContinue.click();
        return new HomePage(this.page);
    }
}
