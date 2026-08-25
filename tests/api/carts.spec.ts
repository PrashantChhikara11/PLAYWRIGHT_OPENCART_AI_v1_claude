import { test, expect } from '@playwright/test';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config({ override: true });

test.describe('Carts API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const CART_ID = Number(process.env.CART_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const START_DATE = process.env.START_DATE as string;
    const END_DATE = process.env.END_DATE as string;

    // ---------------------------------------------------------
    // GET - All Carts
    // ---------------------------------------------------------

    test('GET - All carts @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);

        expect(response.status(), 'GET all carts should return 200').toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts), 'Response should be an array').toBeTruthy();
        expect(carts.length, 'Cart array should not be empty').toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - Cart by ID
    // ---------------------------------------------------------

    test('GET - Cart by ID @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`);

        expect(response.status(), 'GET cart by ID should return 200').toBe(200);

        const cart = await response.json();

        expect(cart.id, 'Returned cart ID should match the requested ID').toBe(CART_ID);
        expect(Array.isArray(cart.products), 'Cart should contain a products array').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Carts by Date Range
    // ---------------------------------------------------------

    test('GET - Carts by date range @master @regression @api', async ({ request }) => {

        const route = Routes.GET_CARTS_BY_DATE_RANGE
            .replace('{startdate}', START_DATE)
            .replace('{enddate}', END_DATE);

        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'GET carts by date range should return 200').toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts), 'Response should be an array').toBeTruthy();
        carts.forEach((cart: { date: string }) => {
            const cartDate = new Date(cart.date).getTime();
            expect(cartDate, `Cart date ${cart.date} should be on or after ${START_DATE}`).toBeGreaterThanOrEqual(new Date(START_DATE).getTime());
            expect(cartDate, `Cart date ${cart.date} should be on or before ${END_DATE}`).toBeLessThanOrEqual(new Date(END_DATE).getTime());
        });
    });

    // ---------------------------------------------------------
    // GET - User Cart
    // ---------------------------------------------------------

    test('GET - User cart @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USER_CART.replace('{userId}', String(USER_ID))}`);

        expect(response.status(), 'GET user cart should return 200').toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts), 'Response should be an array').toBeTruthy();
        carts.forEach((cart: { userId: number }) => {
            expect(cart.userId, `Cart should belong to user ${USER_ID}`).toBe(USER_ID);
        });
    });

    // ---------------------------------------------------------
    // GET - Carts with Limit
    // ---------------------------------------------------------

    test('GET - Carts with limit @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`);

        expect(response.status(), 'GET carts with limit should return 200').toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts), 'Response should be an array').toBeTruthy();
        expect(carts.length, `Cart count should match the requested limit (${LIMIT})`).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Sort Carts Ascending
    // ---------------------------------------------------------

    test('GET - Sort carts ascending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'asc')}`);

        expect(response.status(), 'GET sorted carts should return 200').toBe(200);

        const carts = await response.json();
        const ids: number[] = carts.map((cart: { id: number }) => cart.id);
        const sortedIds = [...ids].sort((a, b) => a - b);

        expect(ids, 'Cart IDs should be in ascending order').toEqual(sortedIds);
    });

    // ---------------------------------------------------------
    // GET - Sort Carts Descending
    // ---------------------------------------------------------

    test('GET - Sort carts descending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'desc')}`);

        expect(response.status(), 'GET sorted carts should return 200').toBe(200);

        const carts = await response.json();
        const ids: number[] = carts.map((cart: { id: number }) => cart.id);
        const sortedIds = [...ids].sort((a, b) => b - a);

        expect(ids, 'Cart IDs should be in descending order').toEqual(sortedIds);
    });

    // ---------------------------------------------------------
    // POST - Create Cart
    // ---------------------------------------------------------

    test('POST - Create cart @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateCartPayload(USER_ID);

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });

        expect(createResponse.status(), 'Create cart should return 201').toBe(201);

        const created = await createResponse.json();

        expect(created.id, 'Created cart should have an ID').toBeTruthy();
        expect(created.userId, 'Created cart userId should match the submitted value').toBe(payload.userId);
        expect(created.products, 'Created cart products should match the submitted value').toEqual(payload.products);

        // DELETE - Cleanup Created Resource
        const deleteResponse = await request.delete(`${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(created.id))}`);
        expect(deleteResponse.status(), 'Cleanup delete should return 200').toBe(200);
    });

    // ---------------------------------------------------------
    // PUT - Update Cart
    // ---------------------------------------------------------

    test('PUT - Update cart @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);

        const response = await request.put(`${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(CART_ID))}`, { data: payload });

        expect(response.status(), 'Update cart should return 200').toBe(200);

        const updated = await response.json();

        expect(updated.id, 'Updated cart ID should match the requested ID').toBe(CART_ID);
        expect(updated.products[0].quantity, 'Updated cart quantity should match the submitted value').toBe(payload.products[0].quantity);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Cart
    // ---------------------------------------------------------

    test('DELETE - Delete cart @master @regression @api', async ({ request }) => {

        const response = await request.delete(`${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(CART_ID))}`);

        expect(response.status(), 'Delete cart should return 200').toBe(200);
    });
});
