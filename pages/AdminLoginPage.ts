import { Page, Locator } from '@playwright/test';
import { AdminDashboardPage } from './AdminDashboardPage';

export class AdminLoginPage {
    private readonly page: Page;

    // Locators
    private readonly txtUsername: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;
    private readonly btnCloseSecurityModal: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtUsername = page.getByRole('textbox', { name: 'Username' });
        this.txtPassword = page.getByRole('textbox', { name: 'Password' });
        this.btnLogin = page.getByRole('button', { name: 'Login' });
        // The default admin/admin credentials trigger a security warning modal after login
        this.btnCloseSecurityModal = page.locator('#modal-security button.close');
    }

    /**
     * Navigates to the Admin Portal login page.
     * @param adminUrl - Admin portal URL
     */
    async navigate(adminUrl: string): Promise<void> {
        await this.page.goto(adminUrl);
    }

    /**
     * Logs in to the Admin Portal and dismisses the security notification modal when shown.
     * @param username - Administrator username
     * @param password - Administrator password
     * @returns Promise<AdminDashboardPage> - Instance of the admin dashboard page
     */
    async login(username: string, password: string): Promise<AdminDashboardPage> {
        try {
            await this.txtUsername.fill(username);
            await this.txtPassword.fill(password);
            await this.btnLogin.click();

            // The security modal renders shortly after the dashboard loads, so wait for it
            // rather than checking immediately - otherwise it can appear later and block clicks.
            try {
                await this.btnCloseSecurityModal.waitFor({ state: 'visible', timeout: 5000 });
                await this.btnCloseSecurityModal.click();
            } catch {
                // Modal did not appear - nothing to dismiss.
            }

            return new AdminDashboardPage(this.page);
        } catch (error) {
            console.log(`Error logging into admin portal: ${error}`);
            throw error;
        }
    }
}
