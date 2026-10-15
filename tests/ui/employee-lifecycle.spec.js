const { test, expect } = require('@playwright/test');
const path = require('path');

const employee = require('../../test-data/employee.json');

const { LoginPage } = require('../../pages/LoginPage');
const { PimPage } = require('../../pages/PimPage');
const { DashboardPage } = require('../../pages/DashboardPage');

test('Employee lifecycle: login, create, update, delete and logout', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const pimPage = new PimPage(page);
  const dashboardPage = new DashboardPage(page);

  const projectRoot = path.resolve(__dirname, '../..');
  const username = process.env.ORANGEHRM_USERNAME || 'Admin';
  const password = process.env.ORANGEHRM_PASSWORD || 'admin123';

  await test.step('Login and verify dashboard', async () => {
    await loginPage.open();
    await loginPage.login(username, password);
    await loginPage.expectLoggedIn();
  });

  await test.step('Create employee using JSON data and upload profile picture', async () => {
    await pimPage.open();
    await pimPage.openAddEmployee();
    await pimPage.createEmployee(employee, projectRoot);
  });

  await test.step('Search employee and update job details', async () => {
    await pimPage.searchEmployee(employee.employeeId);
    await pimPage.openFirstSearchResult(employee.employeeId);
    await pimPage.updateJobDetails(
      employee.jobTitle,
      employee.employmentStatus
    );
  });

  await test.step('Delete employee and verify it is absent', async () => {
    await pimPage.deleteEmployee(employee.employeeId);
  });

  await test.step('Logout and verify login page returns', async () => {
    await dashboardPage.logout();
    await loginPage.expectLoggedOut();
  });
});
