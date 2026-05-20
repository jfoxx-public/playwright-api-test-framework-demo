// env.ts

export const ENV = process.env.ENV || 'dev';

export const BASE_URLS = {
  // For running tests locally from your Mac terminal against local containers:
  staging_local: 'http://localhost:4000',     // Command: ENV=staging_local npx playwright test
  dev_local:     'http://localhost:4001',     // Command: ENV=dev_local npx playwright test
  
  // Exclusive for CI/CD (Jenkins) internal Docker network routing. Do not run manually from Mac:
  staging:       'http://staging-api:4000',   // Automatically resolved by Jenkins in Staging (Injects ENV=staging)
  dev:           'http://dev-api:4001'        // Automatically resolved by Jenkins in Dev (Injects ENV=dev)
};

export const BASE_URL = process.env.BASE_URL || BASE_URLS[ENV as keyof typeof BASE_URLS];
