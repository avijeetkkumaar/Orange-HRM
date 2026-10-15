
const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.getByRole('textbox', {
      name: /username|nombre de usuario/i
    });
    this.password = page.locator('input[type="password"]');
    this.loginButton = page.getByRole('button', {
      name: /login|ingresar/i
    });
  }

  async open() {
    await this.page.goto('/web/index.php/auth/login');
  }

  async login(username, password) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  async expectLoggedIn() {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(
      this.page.locator('.oxd-topbar-header-breadcrumb')
    ).toContainText(/dashboard|pizarra de pendientes/i);
  }

  async expectLoggedOut() {
    await expect(this.username).toBeVisible();
  }
}

module.exports = { LoginPage };
