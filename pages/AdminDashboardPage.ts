import { Page, Locator } from '@playwright/test';
import { AdminCustomerListPage } from './AdminCustomerListPage';

export class AdminDashboardPage {
    private readonly page: Page;

    // Locators
    private readonly linkCustomersMenu: Locator;
    private readonly linkCustomersSubmenu: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        // The sidebar "Customers" toggle and its submenu link share the same accessible name,
        // so each is scoped to its own DOM container (the collapse target id) to stay unambiguous.
        this.linkCustomersMenu = page.locator('a[href="#collapse5"]');
        this.linkCustomersSubmenu = page.locator('#collapse5').getByRole('link', { name: 'Customers' });
    }

    /**
     * Opens the Customers sidebar menu and navigates to the customer list.
     * @returns Promise<AdminCustomerListPage> - Instance of the customer list page
     */
    async clickCustomers(): Promise<AdminCustomerListPage> {
        await this.linkCustomersMenu.click();
        await this.linkCustomersSubmenu.click();
        return new AdminCustomerListPage(this.page);
    }
}
