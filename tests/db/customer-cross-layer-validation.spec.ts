/**
 * Test Case: OpenCart Customer Registration - Web + Admin + MySQL Cross-Layer Validation
 *
 * Tags: @master @regression @end-to-end @db
 *
 * Steps:
 * 1) Register a new customer through the frontend using dynamically generated data
 * 2) Verify the customer exists in the OpenCart Admin Portal with matching details
 * 3) Verify the customer exists in the MySQL oc_customer table with matching details
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { executeQuery } from '../../utils/dbClient';
import dotenv from 'dotenv';

dotenv.config();

interface CustomerRow {
    firstname: string;
    lastname: string;
    email: string;
    status: number;
    date_added: string;
}

test('OpenCart customer registration cross-layer validation @master @regression @db', async ({
    homePage,
    registerPage,
    myAccountPage,
    adminLoginPage,
    adminDashboardPage,
    adminCustomerListPage,
    adminCustomerDetailsPage,
}) => {
    const ADMIN_URL = process.env.ADMIN_URL as string;
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME as string;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD as string;

    const userData = {
        firstName: RandomDataUtil.getFirstName(),
        lastName: RandomDataUtil.getLastName(),
        email: RandomDataUtil.getEmail(),
        telephone: RandomDataUtil.getPhoneNumber(),
        password: RandomDataUtil.getPassword(),
    };

    await test.step('1) Register a customer through the frontend', async () => {
        await homePage.clickMyAccount();
        await homePage.clickRegister();
        await registerPage.register(userData);

        const isSuccessful = await registerPage.isRegistrationSuccessful();
        expect(isSuccessful, 'Registration should succeed').toBeTruthy();

        await registerPage.clickContinueToMyAccount();
        const isMyAccountDisplayed = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountDisplayed, 'My Account page should be displayed after registration').toBeTruthy();
    });

    await test.step('2) Verify the customer in the Admin Portal', async () => {
        await adminLoginPage.navigate(ADMIN_URL);
        await adminLoginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);

        const customerListPage = await adminDashboardPage.clickCustomers();
        await customerListPage.searchByEmail(userData.email);

        const isCustomerFound = await adminCustomerListPage.isCustomerFound(userData.email);
        expect(isCustomerFound, `Customer with email ${userData.email} should be found in the Admin Portal`).toBeTruthy();

        await adminCustomerListPage.openCustomerDetails(userData.email);

        const adminFirstName = await adminCustomerDetailsPage.getFirstName();
        const adminLastName = await adminCustomerDetailsPage.getLastName();
        const adminEmail = await adminCustomerDetailsPage.getEmail();
        const adminStatus = await adminCustomerDetailsPage.getStatus();

        expect(adminFirstName, 'Admin Portal first name should match the registered value').toBe(userData.firstName);
        expect(adminLastName, 'Admin Portal last name should match the registered value').toBe(userData.lastName);
        expect(adminEmail, 'Admin Portal email should match the registered value').toBe(userData.email);
        expect(adminStatus, 'Admin Portal status should show the customer as Enabled').toBe('Enabled');
    });

    await test.step('3) Verify the customer in the MySQL oc_customer table', async () => {
        try {
            const rows = (await executeQuery(
                'SELECT firstname, lastname, email, status, date_added FROM oc_customer WHERE email = ?',
                [userData.email],
            )) as unknown as CustomerRow[];

            expect(rows.length, `Exactly one customer record should exist for ${userData.email}`).toBe(1);

            const customer = rows[0];
            expect(customer.firstname, 'Database firstname should match the registered value').toBe(userData.firstName);
            expect(customer.lastname, 'Database lastname should match the registered value').toBe(userData.lastName);
            expect(customer.email, 'Database email should match the registered value').toBe(userData.email);
            expect(customer.status, 'Database status should be 1 (Enabled) for a newly registered customer').toBe(1);
            expect(customer.date_added, 'Database date_added should exist').toBeTruthy();
        } catch (error) {
            console.log(`Error validating customer in the database: ${error}`);
            throw error;
        }
    });

    console.log('✅ ✔️ Completed successfully!');
});
