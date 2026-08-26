import { Page, Locator } from '@playwright/test';
import { RegisterPage } from './RegisterPage';
import { LoginPage } from './LoginPage';
import { SearchResultsPage } from './SearchResultsPage';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly linkMyAccount: Locator;
    private readonly linkRegister: Locator;
    private readonly linkLogin: Locator;
    private readonly txtSearch: Locator;
    private readonly btnSearch: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        // Scoped to #top since "My Account" / "Register" / "Login" links are duplicated in the page footer
        this.linkMyAccount = page.locator('#top').getByRole('link', { name: 'My Account' });
        this.linkRegister = page.locator('#top').getByRole('link', { name: 'Register', exact: true });
        this.linkLogin = page.locator('#top').getByRole('link', { name: 'Login', exact: true });
        this.txtSearch = page.getByRole('textbox', { name: 'Search' });
        this.btnSearch = page.locator('#search').getByRole('button');
    }

    /**
     * Opens the "My Account" dropdown menu in the header.
     */
    async clickMyAccount(): Promise<void> {
        await this.linkMyAccount.click();
    }

    /**
     * Clicks "Register" in the My Account dropdown.
     * @returns Promise<RegisterPage> - Instance of the register page
     */
    async clickRegister(): Promise<RegisterPage> {
        await this.linkRegister.click();
        return new RegisterPage(this.page);
    }

    /**
     * Clicks "Login" in the My Account dropdown.
     * @returns Promise<LoginPage> - Instance of the login page
     */
    async clickLogin(): Promise<LoginPage> {
        await this.linkLogin.click();
        return new LoginPage(this.page);
    }

    /**
     * Verifies the guest "Register"/"Login" menu is shown (i.e. no account is authenticated).
     * Call after clickMyAccount() has opened the dropdown.
     * @returns Promise<boolean> - true if both Register and Login links are visible
     */
    async isGuestMenuDisplayed(): Promise<boolean> {
        try {
            await this.linkRegister.waitFor({ state: 'visible', timeout: 10000 });
            await this.linkLogin.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking guest menu: ${error}`);
            return false;
        }
    }

    /**
     * Searches for a product using the header search field.
     * @param productName - Product name to search for
     * @returns Promise<SearchResultsPage> - Instance of the search results page
     */
    async searchProduct(productName: string): Promise<SearchResultsPage> {
        try {
            await this.txtSearch.fill(productName);
            await this.btnSearch.click();
            return new SearchResultsPage(this.page);
        } catch (error) {
            console.log(`Error searching for product: ${error}`);
            throw error;
        }
    }
}
