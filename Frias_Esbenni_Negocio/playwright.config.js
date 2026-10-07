// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

module.exports = defineConfig({
  testDir: './tests',
  timeout: 15_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: BASE_URL, trace: 'on-first-retry', screenshot: 'only-on-failure' },

  
  // Levanta el servidor automaticamente antes de las pruebas
  webServer: {
    command: 'node server.js',
    url: BASE_URL,
    reuseExistingServer: true,
    env: { PORT: String(PORT) },
  },
  projects: [
    { name: 'ui', testMatch: /.*\.ui\.spec\.js/, use: { ...devices['Desktop Chrome'] } },
    { name: 'api', testMatch: /.*\.api\.spec\.js/ },
  ],
});
