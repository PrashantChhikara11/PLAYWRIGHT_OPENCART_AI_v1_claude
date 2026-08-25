import { test, expect } from '@playwright/test';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config({ override: true });

test.describe('Auth API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USERNAME = process.env.USERNAME as string;
    const PASSWORD = process.env.PASSWORD as string;

    // ---------------------------------------------------------
    // POST - Successful Login
    // ---------------------------------------------------------

    test('POST - Successful login @master @sanity @api', async ({ request }) => {

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: { username: USERNAME, password: PASSWORD },
        });

        expect(response.status(), 'Login with valid credentials should return 201').toBe(201);

        const responseBody = await response.json();

        expect(responseBody.token, 'Response should contain a token').toBeTruthy();
        expect(typeof responseBody.token, 'Token should be a string').toBe('string');
        expect(responseBody.token.length, 'Token should be non-empty').toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // POST - Invalid Login
    // ---------------------------------------------------------

    test('POST - Invalid login @master @regression @api', async ({ request }) => {

        const invalidCredentials = RandomDataUtil.generateInvalidLoginPayload();

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: invalidCredentials,
        });

        expect(response.status(), 'Login with invalid credentials should return 401').toBe(401);

        const responseText = await response.text();

        expect(responseText, 'Error message should match the API contract').toBe('username or password is incorrect');
    });
});
