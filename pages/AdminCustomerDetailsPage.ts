import { Page, Locator } from '@playwright/test';

export class AdminCustomerDetailsPage {
    private readonly page: Page;

    // Locators
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtEmail: Locator;
    private readonly comboStatus: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtFirstName = page.getByRole('textbox', { name: '* First Name' });
        this.txtLastName = page.getByRole('textbox', { name: '* Last Name' });
        this.txtEmail = page.getByRole('textbox', { name: '* E-Mail' });
        this.comboStatus = page.getByRole('combobox', { name: 'Status' });
    }

    /**
     * Returns the customer's first name shown in the details form.
     * @returns Promise<string> - First name value
     */
    async getFirstName(): Promise<string> {
        return await this.txtFirstName.inputValue();
    }

    /**
     * Returns the customer's last name shown in the details form.
     * @returns Promise<string> - Last name value
     */
    async getLastName(): Promise<string> {
        return await this.txtLastName.inputValue();
    }

    /**
     * Returns the customer's email shown in the details form.
     * @returns Promise<string> - Email value
     */
    async getEmail(): Promise<string> {
        return await this.txtEmail.inputValue();
    }

    /**
     * Returns the customer's status shown in the details form (e.g. "Enabled" or "Disabled").
     * @returns Promise<string> - Selected status label
     */
    async getStatus(): Promise<string> {
        return await this.comboStatus.locator('option:checked').textContent() ?? '';
    }
}
