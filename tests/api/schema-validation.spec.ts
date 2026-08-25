import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import { DataProvider } from '../../utils/DataReader';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config({ override: true });

test.describe('Schema Validation API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const CART_ID = Number(process.env.CART_ID ?? 1);

    const ajv = new Ajv();

    // ---------------------------------------------------------
    // Product Response Schema
    // ---------------------------------------------------------

    test('GET - Product response matches schema @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`);
        expect(response.status(), 'GET product by ID should return 200').toBe(200);

        const product = await response.json();
        const schema = DataProvider.readJson('./api/schemas/product_api_schema.json');

        const validate = ajv.compile(schema);
        const isValid = validate(product);

        expect(isValid, `Product response should match schema: ${JSON.stringify(validate.errors)}`).toBeTruthy();
    });

    // ---------------------------------------------------------
    // User Response Schema
    // ---------------------------------------------------------

    test('GET - User response matches schema @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`);
        expect(response.status(), 'GET user by ID should return 200').toBe(200);

        const user = await response.json();
        const schema = DataProvider.readJson('./api/schemas/user_api_schema.json');

        const validate = ajv.compile(schema);
        const isValid = validate(user);

        expect(isValid, `User response should match schema: ${JSON.stringify(validate.errors)}`).toBeTruthy();
    });

    // ---------------------------------------------------------
    // Cart Response Schema
    // ---------------------------------------------------------

    test('GET - Cart response matches schema @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`);
        expect(response.status(), 'GET cart by ID should return 200').toBe(200);

        const cart = await response.json();
        const schema = DataProvider.readJson('./api/schemas/cart_api_schema.json');

        const validate = ajv.compile(schema);
        const isValid = validate(cart);

        expect(isValid, `Cart response should match schema: ${JSON.stringify(validate.errors)}`).toBeTruthy();
    });
});
