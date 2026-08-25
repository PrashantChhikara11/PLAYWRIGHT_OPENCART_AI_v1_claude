import { test, expect } from '@playwright/test';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config({ override: true });

test.describe('Users API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);

    // ---------------------------------------------------------
    // GET - All Users
    // ---------------------------------------------------------

    test('GET - All users @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);

        expect(response.status(), 'GET all users should return 200').toBe(200);

        const users = await response.json();

        expect(Array.isArray(users), 'Response should be an array').toBeTruthy();
        expect(users.length, 'User array should not be empty').toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - User by ID
    // ---------------------------------------------------------

    test('GET - User by ID @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`);

        expect(response.status(), 'GET user by ID should return 200').toBe(200);

        const user = await response.json();

        expect(user.id, 'Returned user ID should match the requested ID').toBe(USER_ID);
        expect(user.email, 'User should have an email').toBeTruthy();
        expect(user.username, 'User should have a username').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Users with Limit
    // ---------------------------------------------------------

    test('GET - Users with limit @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USERS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`);

        expect(response.status(), 'GET users with limit should return 200').toBe(200);

        const users = await response.json();

        expect(Array.isArray(users), 'Response should be an array').toBeTruthy();
        expect(users.length, `User count should match the requested limit (${LIMIT})`).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Sort Users Ascending
    // ---------------------------------------------------------

    test('GET - Sort users ascending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'asc')}`);

        expect(response.status(), 'GET sorted users should return 200').toBe(200);

        const users = await response.json();
        const ids: number[] = users.map((user: { id: number }) => user.id);
        const sortedIds = [...ids].sort((a, b) => a - b);

        expect(ids, 'User IDs should be in ascending order').toEqual(sortedIds);
    });

    // ---------------------------------------------------------
    // GET - Sort Users Descending
    // ---------------------------------------------------------

    test('GET - Sort users descending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'desc')}`);

        expect(response.status(), 'GET sorted users should return 200').toBe(200);

        const users = await response.json();
        const ids: number[] = users.map((user: { id: number }) => user.id);
        const sortedIds = [...ids].sort((a, b) => b - a);

        expect(ids, 'User IDs should be in descending order').toEqual(sortedIds);
    });

    // ---------------------------------------------------------
    // POST - Create User
    // ---------------------------------------------------------

    test('POST - Create user @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserPayload();

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });

        expect(createResponse.status(), 'Create user should return 201').toBe(201);

        const created = await createResponse.json();

        // fakestoreapi's create-user response only returns the generated id
        expect(created.id, 'Created user should have an ID').toBeTruthy();

        // DELETE - Cleanup Created Resource
        const deleteResponse = await request.delete(`${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(created.id))}`);
        expect(deleteResponse.status(), 'Cleanup delete should return 200').toBe(200);
    });

    // ---------------------------------------------------------
    // PUT - Update User
    // ---------------------------------------------------------

    test('PUT - Update user @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserUpdatePayload();

        const response = await request.put(`${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(USER_ID))}`, { data: payload });

        expect(response.status(), 'Update user should return 200').toBe(200);

        const updated = await response.json();

        expect(updated.email, 'Updated user email should match the submitted value').toBe(payload.email);
        expect(updated.username, 'Updated user username should match the submitted value').toBe(payload.username);
    });

    // ---------------------------------------------------------
    // DELETE - Delete User
    // ---------------------------------------------------------

    test('DELETE - Delete user @master @regression @api', async ({ request }) => {

        const response = await request.delete(`${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(USER_ID))}`);

        expect(response.status(), 'Delete user should return 200').toBe(200);
    });
});
