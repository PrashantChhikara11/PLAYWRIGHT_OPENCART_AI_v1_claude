import { Page, Locator } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export interface RegisterUserData {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    password: string;
}

export class RegisterPage {
    private readonly page: Page;

    // Locators
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtEmail: Locator;
    private readonly txtTelephone: Locator;
    private readonly txtPassword: Locator;
    private readonly txtPasswordConfirm: Locator;
    private readonly chkPrivacyPolicy: Locator;
    private readonly btnContinue: Locator;
    private readonly headingAccountCreated: Locator;
    private readonly linkContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtFirstName = page.getByRole('textbox', { name: '* First Name' });
        this.txtLastName = page.getByRole('textbox', { name: '* Last Name' });
        this.txtEmail = page.getByRole('textbox', { name: '* E-Mail' });
        this.txtTelephone = page.getByRole('textbox', { name: '* Telephone' });
        this.txtPassword = page.getByRole('textbox', { name: '* Password', exact: true });
        this.txtPasswordConfirm = page.getByRole('textbox', { name: '* Password Confirm' });
        this.chkPrivacyPolicy = page.getByRole('checkbox');
        this.btnContinue = page.getByRole('button', { name: 'Continue' });
        this.headingAccountCreated = page.getByRole('heading', { name: 'Your Account Has Been Created!' });
        this.linkContinue = page.getByRole('link', { name: 'Continue' });
    }

    /**
     * Fills the registration form, accepts the privacy policy, and submits it.
     * @param userData - Customer details to register with
     */
    async register(userData: RegisterUserData): Promise<void> {
        try {
            await this.txtFirstName.fill(userData.firstName);
            await this.txtLastName.fill(userData.lastName);
            await this.txtEmail.fill(userData.email);
            await this.txtTelephone.fill(userData.telephone);
            await this.txtPassword.fill(userData.password);
            await this.txtPasswordConfirm.fill(userData.password);
            await this.chkPrivacyPolicy.check();
            await this.btnContinue.click();
        } catch (error) {
            console.log(`Error registering user: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the "Your Account Has Been Created!" confirmation is displayed.
     * @returns Promise<boolean> - true if the registration success message is shown
     */
    async isRegistrationSuccessful(): Promise<boolean> {
        try {
            await this.headingAccountCreated.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking registration success: ${error}`);
            return false;
        }
    }

    /**
     * Clicks "Continue" on the registration success page.
     * @returns Promise<MyAccountPage> - Instance of the My Account dashboard page
     */
    async clickContinueToMyAccount(): Promise<MyAccountPage> {
        await this.linkContinue.click();
        return new MyAccountPage(this.page);
    }
}
