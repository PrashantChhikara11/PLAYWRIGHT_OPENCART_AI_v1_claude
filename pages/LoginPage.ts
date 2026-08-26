import { Page, Locator } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly txtEmail: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;
    private readonly txtWarningMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtEmail = page.getByRole('textbox', { name: 'E-Mail Address' });
        this.txtPassword = page.getByRole('textbox', { name: 'Password', exact: true });
        this.btnLogin = page.getByRole('button', { name: 'Login' });
        this.txtWarningMessage = page.locator('.alert-danger');
    }

    /**
     * Fills the email and password fields (leaving a field empty when the value is blank) and submits the login form.
     * @param email - Customer email address
     * @param password - Customer password
     */
    async login(email: string, password: string): Promise<void> {
        try {
            if (email.trim()) {
                await this.txtEmail.fill(email);
            }
            if (password.trim()) {
                await this.txtPassword.fill(password);
            }
            await this.btnLogin.click();
        } catch (error) {
            console.log(`Error logging in: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the invalid-login warning message is displayed.
     * @returns Promise<boolean> - true if the warning message is shown
     */
    async isWarningMessageDisplayed(): Promise<boolean> {
        try {
            await this.txtWarningMessage.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking warning message: ${error}`);
            return false;
        }
    }

    /**
     * Returns the text of the login warning message.
     * @returns Promise<string> - Trimmed warning message text
     */
    async getWarningMessage(): Promise<string> {
        return ((await this.txtWarningMessage.textContent()) ?? '').trim();
    }
}
