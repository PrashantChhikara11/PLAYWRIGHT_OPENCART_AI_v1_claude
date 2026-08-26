import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  timeout: 60 * 1000,   //60000 ms(60 secs) - remote target (awesomeqa.com) adds network latency and an initial bot-check wait
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],                           // Detailed console output
    //['line'],                         // One-line progress output
    //['dot'],                          // Minimal console output
    ['html', { open: 'never', outputFolder: 'reports' }],        // HTML Report
    //['json', { outputFile: 'reports/results.json' }], // JSON Report
    //['junit', { outputFile: 'reports/results.xml' }]  // JUnit XML Report
    ['./utils/CustomReporter.ts'], // Custom reporter
    ['allure-playwright', { outputFolder: 'allure-results' }]  // Allure Report
  ],
  use: {
    baseURL: process.env.WEB_APP_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false,
    viewport: { width: 1280, height: 720 }, // Set default viewport size for consistency
    ignoreHTTPSErrors: true, // Ignore SSL errors if necessary
    permissions: ['geolocation'], // Set necessary permissions for geolocation-based tests
  },
  grep: /@master/,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }
    */
  ],
});
