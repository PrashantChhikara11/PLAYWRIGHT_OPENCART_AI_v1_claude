import { Page, Locator } from '@playwright/test';
import { AdminCustomerDetailsPage } from './AdminCustomerDetailsPage';

export class AdminCustomerListPage {
    private readonly page: Page;

    // Locators
    private readonly txtEmailFilter: Locator;
    private readonly btnFilter: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtEmailFilter = page.getByRole('textbox', { name: 'E-Mail' });
        this.btnFilter = page.getByRole('button', { name: 'Filter' });
    }

    /**
     * Returns the customer table row matching the given email address.
     */
    private customerRow(email: string): Locator {
        return this.page.getByRole('row').filter({ hasText: email });
    }

    /**
     * Filters the customer list by email address.
     * @param email - Customer email to search for
     */
    async searchByEmail(email: string): Promise<void> {
        await this.txtEmailFilter.fill(email);
        await this.btnFilter.click();
    }

    /**
     * Verifies the customer with the given email is found in the filtered list.
     * @param email - Customer email to look for
     * @returns Promise<boolean> - true if exactly the customer row is visible
     */
    async isCustomerFound(email: string): Promise<boolean> {
        try {
            return await this.customerRow(email).isVisible();
        } catch (error) {
            console.log(`Error checking customer list: ${error}`);
            return false;
        }
    }

    /**
     * Opens the customer details/edit page for the given email.
     * @param email - Customer email whose record should be opened
     * @returns Promise<AdminCustomerDetailsPage> - Instance of the customer details page
     */
    async openCustomerDetails(email: string): Promise<AdminCustomerDetailsPage> {
        await this.customerRow(email).locator('a[href*="customer/customer/edit"]').click();
        return new AdminCustomerDetailsPage(this.page);
    }
}
