
require('dotenv').config();

const { test, expect } = require('@playwright/test');

const baseURL = 'https://reqres.in/api';
const projectId = process.env.REQRES_PROJECT_ID || '54755';
const endpoint = `/collections/products/records?project_id=${projectId}`;
const apiKey = process.env.REQRES_API_KEY;
const environment = process.env.REQRES_ENV || 'prod';

const headers = {
  'x-api-key': apiKey,
  'X-Reqres-Env': environment,
  'Content-Type': 'application/json',
};

test.describe.serial('ReqRes Products API CRUD', () => {
  let recordId;

  test.beforeAll(() => {
    expect(apiKey, 'REQRES_API_KEY must be set in .env').toBeTruthy();
  });

  test('GET - List product records', async ({ request }) => {
    const response = await request.get(
      `${baseURL}${endpoint}`,
      { headers }
    );

    expect(
      response.status(),
      `GET list failed: ${response.status()} ${await response.text()}`
    ).toBe(200);

    const body = await response.json();
    expect(body.data).toBeInstanceOf(Array);
  });

  test('POST - Create a product record', async ({ request }) => {
    const response = await request.post(
      `${baseURL}${endpoint}`,
      {
        headers,
        data: {
          data: {
            name: 'Playwright Test Product',
            price: 99.99,
            category: 'Electronics',
            in_stock: true,
          },
        },
      }
    );

    expect(
      response.status(),
      `POST create failed: ${response.status()} ${await response.text()}`
    ).toBe(201);

    const body = await response.json();
    expect(body.data.id).toBeTruthy();
    expect(body.data.data.name).toBe('Playwright Test Product');

    recordId = body.data.id;
  });

  test('GET - Verify the created product', async ({ request }) => {
    expect(recordId).toBeTruthy();

    const response = await request.get(
      `${baseURL}/collections/products/records/${recordId}?project_id=${projectId}`,
      { headers }
    );

    expect(
      response.status(),
      `GET record failed: ${response.status()} ${await response.text()}`
    ).toBe(200);

    const body = await response.json();
    expect(body.data.id).toBe(recordId);
    expect(body.data.data.name).toBe('Playwright Test Product');
  });

  test('PUT - Update the created product', async ({ request }) => {
    expect(recordId).toBeTruthy();

    const response = await request.put(
      `${baseURL}/collections/products/records/${recordId}?project_id=${projectId}`,
      {
        headers,
        data: {
          data: {
            name: 'Updated Playwright Product',
            price: 149.99,
            category: 'Electronics',
            in_stock: true,
          },
        },
      }
    );

    expect(
      response.status(),
      `PUT update failed: ${response.status()} ${await response.text()}`
    ).toBe(200);

    const body = await response.json();
    expect(body.data.data.name).toBe('Updated Playwright Product');
    expect(body.data.data.price).toBe(149.99);
  });

  test('GET - Verify the updated product', async ({ request }) => {
    expect(recordId).toBeTruthy();

    const response = await request.get(
      `${baseURL}/collections/products/records/${recordId}?project_id=${projectId}`,
      { headers }
    );

    expect(
      response.status(),
      `GET updated record failed: ${response.status()} ${await response.text()}`
    ).toBe(200);

    const body = await response.json();
    expect(body.data.data.name).toBe('Updated Playwright Product');
    expect(body.data.data.price).toBe(149.99);
  });

  test('DELETE - Delete the created product', async ({ request }) => {
    expect(recordId).toBeTruthy();

    const response = await request.delete(
      `${baseURL}/collections/products/records/${recordId}?project_id=${projectId}`,
      { headers }
    );

    expect(
      response.status(),
      `DELETE failed: ${response.status()} ${await response.text()}`
    ).toBe(204);
  });

  test('GET - Verify the deleted product returns 404', async ({ request }) => {
    expect(recordId).toBeTruthy();

    const response = await request.get(
      `${baseURL}/collections/products/records/${recordId}?project_id=${projectId}`,
      { headers }
    );

    expect(response.status()).toBe(404);
  });
});
