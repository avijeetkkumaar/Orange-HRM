
const { expect } = require('@playwright/test');
const path = require('path');

class PimPage {
  constructor(page) {
    this.page = page;
    this.pimMenu = page.getByRole('link', { name: /^PIM$/i });
  }

  async open() {
    await this.pimMenu.click();
    await expect(this.page).toHaveURL(/pim/i);
  }

  async openAddEmployee() {
    await this.page.getByText('Add Employee', { exact: true }).first().click();

    await expect(this.page).toHaveURL(/addEmployee/i, {
      timeout: 20000
    });

    await expect(
      this.page.getByPlaceholder('First Name')
    ).toBeVisible({ timeout: 20000 });
  }

  async createEmployee(employee, projectRoot) {
    await this.page.getByPlaceholder('First Name').fill(employee.firstName);

    const middleName = this.page.getByPlaceholder('Middle Name');

    if (await middleName.count()) {
      await middleName.fill(employee.middleName || '');
    }

    await this.page.getByPlaceholder('Last Name').fill(employee.lastName);

    const formInputs = this.page.locator('form input');
    const employeeIdInput = formInputs.nth(3);

    if (employee.employeeId) {
      await employeeIdInput.fill(employee.employeeId);

      const enteredId = await employeeIdInput.inputValue();
      console.log('Employee ID entered before save:', enteredId);

      expect(enteredId).toBe(employee.employeeId);
    }

    if (employee.profilePicture) {
      const imagePath = path.resolve(projectRoot, employee.profilePicture);
      const fileInput = this.page.locator('input[type="file"]');

      if (await fileInput.count()) {
        await fileInput.setInputFiles(imagePath);
      }
    }

    await this.page.getByRole('button', {
      name: /save|guardar/i
    }).click();

    const personalDetailsHeading = this.page.getByRole('heading', {
      name: /personal details|detalles personales/i
    });

    const duplicateIdError = this.page.getByText(
      /employee id already exists/i
    );

    await expect(
      personalDetailsHeading.or(duplicateIdError)
    ).toBeVisible({ timeout: 20000 });

    if (await duplicateIdError.isVisible().catch(() => false)) {
      throw new Error(
        `Employee ID ${employee.employeeId} already exists. Choose a new ID in test-data/employee.json.`
      );
    }
  }

  async searchEmployee(employeeId) {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');

    await expect(
      this.page.getByRole('heading', {
        name: /employee information|información del empleado/i
      })
    ).toBeVisible({ timeout: 20000 });

    const inputs = this.page.locator('form input');

    console.log('Employee ID to search:', employeeId);
    console.log('Search input count:', await inputs.count());

    await inputs.nth(1).fill(employeeId);

    console.log('Entered search ID:', await inputs.nth(1).inputValue());

    await this.page.getByRole('button', {
      name: /search|buscar/i
    }).click();

    await expect(
      this.page.getByRole('table')
    ).toContainText(employeeId, { timeout: 15000 });
  }

  async openFirstSearchResult(employeeId) {
    const row = this.page.getByRole('row').filter({
      hasText: employeeId
    });

    await expect(row).toBeVisible({ timeout: 15000 });

    await row.locator('.oxd-table-cell').nth(2).click();

    await expect(this.page).toHaveURL(/viewPersonalDetails/i, {
      timeout: 15000
    });
  }

  async updateJobDetails(jobTitle, employmentStatus) {
    await this.page.getByText('Job', { exact: true }).click();

    const jobTitleField = this.page
      .getByText('Job Title', { exact: true })
      .locator('..')
      .locator('..')
      .locator('.oxd-select-text');

    await jobTitleField.click();

    await this.page.getByRole('option', {
      name: jobTitle,
      exact: true
    }).click();

    const statusField = this.page
      .getByText('Employment Status', { exact: true })
      .locator('..')
      .locator('..')
      .locator('.oxd-select-text');

    await statusField.click();

    await this.page.getByRole('option', {
      name: employmentStatus,
      exact: true
    }).click();

    await this.page.getByRole('button', {
      name: /save|guardar/i
    }).last().click();

    await expect(
      this.page.getByText(/successfully updated|actualizado correctamente/i)
    ).toBeVisible({ timeout: 15000 });
  }

  async deleteEmployee(employeeId) {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');

    await expect(
      this.page.getByRole('heading', {
        name: /employee information|información del empleado/i
      })
    ).toBeVisible({ timeout: 20000 });

    const inputs = this.page.locator('form input');
    await inputs.nth(1).fill(employeeId);

    await this.page.getByRole('button', {
      name: /search|buscar/i
    }).click();

    const row = this.page.getByRole('row').filter({
      hasText: employeeId
    });

    await expect(row).toBeVisible({ timeout: 15000 });

    
const checkbox = row.locator('span.oxd-checkbox-input').first();
await expect(checkbox).toBeVisible({ timeout: 15000 });
await checkbox.click();
await expect(row.locator('input[type="checkbox"]')).toBeChecked();

    await this.page.getByRole('button', {
      name: /delete selected|eliminar seleccionados/i
    }).click();

    await this.page.getByRole('button', {
      name: /yes, delete|sí, eliminar|si, eliminar/i
    }).click();

    await expect(
      this.page.getByText(/successfully deleted|eliminado correctamente/i)
    ).toBeVisible({ timeout: 15000 });

    await this.page.getByRole('button', {
      name: /search|buscar/i
    }).click();

    await expect(row).not.toBeVisible({ timeout: 15000 });
  }
}

module.exports = { PimPage };
