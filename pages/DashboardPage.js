const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.profileMenu = page.locator('.oxd-userdropdown-tab');
  }

  async logout() {
    await this.profileMenu.click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
    await expect(this.page.getByPlaceholder('Username')).toBeVisible();
  }
}

module.exports = { DashboardPage };
