import { Page, Locator } from '@playwright/test';
import { LogoutPage } from './LogoutPage';

export class MyAccountPage {
    private readonly page: Page;

    // Locators
    private readonly headingMyAccount: Locator;
    private readonly linkLogout: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingMyAccount = page.getByRole('heading', { name: 'My Account', level: 2 });
        // Scoped to #column-right since a second (hidden) "Logout" link exists in the header dropdown
        this.linkLogout = page.locator('#column-right').getByRole('link', { name: 'Logout' });
    }

    /**
     * Verifies the My Account dashboard page is displayed.
     * @returns Promise<boolean> - true if the My Account heading is visible
     */
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            await this.headingMyAccount.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking My Account page: ${error}`);
            return false;
        }
    }

    /**
     * Clicks "Logout" in the account sidebar.
     * @returns Promise<LogoutPage> - Instance of the logout confirmation page
     */
    async clickLogout(): Promise<LogoutPage> {
        await this.linkLogout.click();
        return new LogoutPage(this.page);
    }
}
