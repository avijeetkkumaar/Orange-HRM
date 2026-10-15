const { test, expect } = require('@playwright/test');
const employeeData = require('../../test-data/employee.json');

test('Simulated employee API: create, read, update and delete', async ({ request }) => {
  let createdId;

  const createResponse = await request.post('http://127.0.0.1:3001/employees', {
    data: {
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      employeeId: employeeData.employeeId,
      jobTitle: employeeData.jobTitle,
      employmentStatus: employeeData.employmentStatus
    }
  });

  expect(createResponse.status(), 'POST should create an employee').toBe(201);
  const created = await createResponse.json();
  createdId = created.id;
  expect(created.employeeId).toBe(employeeData.employeeId);
  expect(created.firstName).toBe(employeeData.firstName);

  const getResponse = await request.get(`http://127.0.0.1:3001/employees/${createdId}`);
  expect(getResponse.status(), 'GET should return the created employee').toBe(200);
  const fetched = await getResponse.json();
  expect(fetched.employeeId).toBe(employeeData.employeeId);
  expect(fetched.jobTitle).toBe(employeeData.jobTitle);

  const updateResponse = await request.patch(`http://127.0.0.1:3001/employees/${createdId}`, {
    data: { jobTitle: 'QA Engineer', employmentStatus: 'Full-Time Permanent' }
  });
  expect(updateResponse.status(), 'PATCH should update employee details').toBe(200);
  const updated = await updateResponse.json();
  expect(updated.jobTitle).toBe('QA Engineer');
  expect(updated.employmentStatus).toBe('Full-Time Permanent');

  // Cross-check API response values against the same data-driven test input.
  expect(updated.firstName).toBe(employeeData.firstName);
  expect(updated.employeeId).toBe(employeeData.employeeId);

  const deleteResponse = await request.delete(`http://127.0.0.1:3001/employees/${createdId}`);
  expect(deleteResponse.status(), 'DELETE should remove the employee').toBe(200);

  const afterDelete = await request.get(`http://127.0.0.1:3001/employees/${createdId}`);
  expect(afterDelete.status(), 'Deleted employee should return 404').toBe(404);
});
