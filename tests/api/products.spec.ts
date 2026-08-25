import { test, expect } from '@playwright/test';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config({ override: true });

test.describe('Products API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const CATEGORY = 'electronics';

    // ---------------------------------------------------------
    // GET - All Products
    // ---------------------------------------------------------

    test('GET - All products @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);

        expect(response.status(), 'GET all products should return 200').toBe(200);

        const products = await response.json();

        expect(Array.isArray(products), 'Response should be an array').toBeTruthy();
        expect(products.length, 'Product array should not be empty').toBeGreaterThan(0);

        const firstProduct = products[0];
        expect(firstProduct.id, 'Product should have an id').toBeTruthy();
        expect(firstProduct.title, 'Product should have a title').toBeTruthy();
        expect(typeof firstProduct.price, 'Product price should be a number').toBe('number');
        expect(firstProduct.category, 'Product should have a category').toBeTruthy();
        expect(firstProduct.image, 'Product should have an image').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Product by ID
    // ---------------------------------------------------------

    test('GET - Product by ID @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`);

        expect(response.status(), 'GET product by ID should return 200').toBe(200);

        const product = await response.json();

        expect(product.id, 'Returned product ID should match the requested ID').toBe(PRODUCT_ID);
        expect(product.title, 'Product should have a title').toBeTruthy();
        expect(typeof product.price, 'Product price should be a number').toBe('number');
        expect(product.category, 'Product should have a category').toBeTruthy();
        expect(product.image, 'Product should have an image').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Products with Limit
    // ---------------------------------------------------------

    test('GET - Products with limit @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`);

        expect(response.status(), 'GET products with limit should return 200').toBe(200);

        const products = await response.json();

        expect(Array.isArray(products), 'Response should be an array').toBeTruthy();
        expect(products.length, `Product count should match the requested limit (${LIMIT})`).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Sort Products Ascending
    // ---------------------------------------------------------

    test('GET - Sort products ascending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc')}`);

        expect(response.status(), 'GET sorted products should return 200').toBe(200);

        const products = await response.json();
        const ids: number[] = products.map((product: { id: number }) => product.id);
        const sortedIds = [...ids].sort((a, b) => a - b);

        expect(ids, 'Product IDs should be in ascending order').toEqual(sortedIds);
    });

    // ---------------------------------------------------------
    // GET - Sort Products Descending
    // ---------------------------------------------------------

    test('GET - Sort products descending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc')}`);

        expect(response.status(), 'GET sorted products should return 200').toBe(200);

        const products = await response.json();
        const ids: number[] = products.map((product: { id: number }) => product.id);
        const sortedIds = [...ids].sort((a, b) => b - a);

        expect(ids, 'Product IDs should be in descending order').toEqual(sortedIds);
    });

    // ---------------------------------------------------------
    // GET - All Product Categories
    // ---------------------------------------------------------

    test('GET - All product categories @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);

        expect(response.status(), 'GET all categories should return 200').toBe(200);

        const categories = await response.json();

        expect(Array.isArray(categories), 'Response should be an array').toBeTruthy();
        expect(categories.length, 'Category array should not be empty').toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - Products by Category
    // ---------------------------------------------------------

    test('GET - Products by category @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', CATEGORY)}`);

        expect(response.status(), 'GET products by category should return 200').toBe(200);

        const products = await response.json();

        expect(Array.isArray(products), 'Response should be an array').toBeTruthy();
        products.forEach((product: { category: string }) => {
            expect(product.category, `Product category should match "${CATEGORY}"`).toBe(CATEGORY);
        });
    });

    // ---------------------------------------------------------
    // POST - Create Product
    // ---------------------------------------------------------

    test('POST - Create product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateProductPayload();

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });

        expect(createResponse.status(), 'Create product should return 201').toBe(201);

        const created = await createResponse.json();

        expect(created.id, 'Created product should have an ID').toBeTruthy();
        expect(created.title, 'Created product title should match the submitted value').toBe(payload.title);
        expect(created.price, 'Created product price should match the submitted value').toBe(payload.price);
        expect(created.category, 'Created product category should match the submitted value').toBe(payload.category);

        // DELETE - Cleanup Created Resource
        const deleteResponse = await request.delete(`${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(created.id))}`);
        expect(deleteResponse.status(), 'Cleanup delete should return 200').toBe(200);
    });

    // ---------------------------------------------------------
    // PUT - Update Product
    // ---------------------------------------------------------

    test('PUT - Update product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUpdatedProductPayload();

        const response = await request.put(`${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`, { data: payload });

        expect(response.status(), 'Update product should return 200').toBe(200);

        const updated = await response.json();

        expect(updated.id, 'Updated product ID should match the requested ID').toBe(PRODUCT_ID);
        expect(updated.title, 'Updated product title should match the submitted value').toBe(payload.title);
        expect(updated.price, 'Updated product price should match the submitted value').toBe(payload.price);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Product
    // ---------------------------------------------------------

    test('DELETE - Delete product @master @regression @api', async ({ request }) => {

        const response = await request.delete(`${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`);

        expect(response.status(), 'Delete product should return 200').toBe(200);
    });
});
