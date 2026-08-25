import { test, expect } from '@playwright/test';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config({ override: true });

test.describe('CRUD Workflow API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID ?? 1);

    // ---------------------------------------------------------
    // Product CRUD Workflow
    // ---------------------------------------------------------

    test('Product CRUD workflow @master @regression @end-to-end @api', async ({ request }) => {

        let productId: number;

        await test.step('1) Create a product', async () => {
            const payload = RandomDataUtil.generateProductPayload();
            const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });

            expect(response.status(), 'Create product should return 201').toBe(201);

            const created = await response.json();
            expect(created.id, 'Created product should have an ID').toBeTruthy();
            productId = created.id;
        });

        await test.step('2) Update the created product', async () => {
            const payload = RandomDataUtil.generateUpdatedProductPayload();
            const response = await request.put(`${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(productId))}`, { data: payload });

            expect(response.status(), 'Update product should return 200').toBe(200);

            const updated = await response.json();
            expect(updated.title, 'Updated product title should match the submitted value').toBe(payload.title);
            expect(updated.price, 'Updated product price should match the submitted value').toBe(payload.price);
        });

        await test.step('3) Delete the created product', async () => {
            const response = await request.delete(`${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(productId))}`);
            expect(response.status(), 'Delete product should return 200').toBe(200);
        });
    });

    // ---------------------------------------------------------
    // User CRUD Workflow
    // ---------------------------------------------------------

    test('User CRUD workflow @master @regression @end-to-end @api', async ({ request }) => {

        let userId: number;

        await test.step('1) Create a user', async () => {
            const payload = RandomDataUtil.generateUserPayload();
            const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });

            expect(response.status(), 'Create user should return 201').toBe(201);

            const created = await response.json();
            expect(created.id, 'Created user should have an ID').toBeTruthy();
            userId = created.id;
        });

        await test.step('2) Update the created user', async () => {
            const payload = RandomDataUtil.generateUserUpdatePayload();
            const response = await request.put(`${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(userId))}`, { data: payload });

            expect(response.status(), 'Update user should return 200').toBe(200);

            const updated = await response.json();
            expect(updated.email, 'Updated user email should match the submitted value').toBe(payload.email);
            expect(updated.username, 'Updated user username should match the submitted value').toBe(payload.username);
        });

        await test.step('3) Delete the created user', async () => {
            const response = await request.delete(`${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(userId))}`);
            expect(response.status(), 'Delete user should return 200').toBe(200);
        });
    });

    // ---------------------------------------------------------
    // Cart CRUD Workflow
    // ---------------------------------------------------------

    test('Cart CRUD workflow @master @regression @end-to-end @api', async ({ request }) => {

        let cartId: number;

        await test.step('1) Create a cart', async () => {
            const payload = RandomDataUtil.generateCartPayload(USER_ID);
            const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });

            expect(response.status(), 'Create cart should return 201').toBe(201);

            const created = await response.json();
            expect(created.id, 'Created cart should have an ID').toBeTruthy();
            expect(created.userId, 'Created cart userId should match the submitted value').toBe(payload.userId);
            expect(created.products, 'Created cart products should match the submitted value').toEqual(payload.products);
            cartId = created.id;
        });

        await test.step('2) Update the created cart with a changed quantity', async () => {
            const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
            const response = await request.put(`${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(cartId))}`, { data: payload });

            expect(response.status(), 'Update cart should return 200').toBe(200);

            const updated = await response.json();
            expect(updated.products[0].quantity, 'Updated cart quantity should match the submitted value').toBe(payload.products[0].quantity);
        });

        await test.step('3) Delete the created cart', async () => {
            const response = await request.delete(`${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(cartId))}`);
            expect(response.status(), 'Delete cart should return 200').toBe(200);
        });
    });
});
