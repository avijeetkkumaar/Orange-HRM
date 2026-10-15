# OrangeHRM Playwright QA Automation

This starter project is based on the supplied Quality Engineer technical assessment.

## Included
- Playwright Test + JavaScript
- Page Object Model (Login, PIM, Dashboard)
- JSON-driven employee test data
- OrangeHRM UI lifecycle test
- Simulated local employee REST API test (POST, GET, PATCH, DELETE)
- HTML report, trace, failure screenshot, and video on failure
- `.gitignore` excludes node_modules, reports, and macOS `._*` metadata files

## Important API note
The sample OrangeHRM demo does not provide a stable, documented public employee API for this assessment. The API test therefore uses a local simulated API (`mock-api/server.js`), which the Playwright config starts automatically. It tests API request/response behaviour, but it is **not the OrangeHRM application's real backend** and does not prove that the UI database and API database are the same. The UI and API suites are separate.

## Requirements
- Node.js LTS (18+ recommended)
- VS Code
- Internet access for the OrangeHRM demo and Playwright browser install

## Setup
Open this folder in VS Code, then run in the integrated terminal:

```bash
npm install
npx playwright install chromium
```

## Run tests
Run all UI and API tests:

```bash
npm test
```

Run only the UI lifecycle test:

```bash
npm run test:ui
```

Run only the simulated API test:

```bash
npm run test:api
```

Run UI in a visible browser:

```bash
npm run test:headed
```

Open HTML report after a test run:

```bash
npm run report
```

The report is generated in `playwright-report/`. Videos, traces, and failure screenshots are saved in `test-results/`. Video is configured to be retained on failure to keep the repository small; change `video: 'retain-on-failure'` to `video: 'on'` if the assignment reviewer requires a video for every run.

## Test data
Edit `test-data/employee.json` to change the employee values. Use a unique Employee ID if the OrangeHRM demo retains data between runs.

## UI test notes
OrangeHRM is a live demo and its layout or data can change. If a locator fails, run `npm run test:headed` and inspect the UI. The Employee ID field, job dropdowns, profile-picture upload, and delete confirmation are the most likely places to require locator updates for a changed demo version.

## GitHub
After the project runs successfully:

```bash
git init
git add .
git commit -m "Add OrangeHRM Playwright UI and API automation"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your actual GitHub repository URL. Do not commit `node_modules`, generated reports, credentials, or personal data.
