import { defineConfig, devices } from '@playwright/test';

const host = '127.0.0.1';
const port = Number(process.env.PLAYWRIGHT_PORT ?? 4331);
const evidenceRoot = process.env.QA_EVIDENCE_DIR ?? 'review/v1.2';
const buildCommand = process.env.PLAYWRIGHT_BUILD_MODE === 'production'
  ? 'npm run build'
  : 'npm run build:review';

export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/unit/**'],
  outputDir: `${evidenceRoot}/test-results`,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['line'],
    ['html', { outputFolder: `${evidenceRoot}/playwright-report`, open: 'never' }]
  ],
  use: {
    baseURL: `http://${host}:${port}`,
    ...devices['Desktop Chrome'],
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: `${buildCommand} && npm run preview -- --host ${host} --port ${port}`,
    url: `http://${host}:${port}/blog/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe'
  }
});
