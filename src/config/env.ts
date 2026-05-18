export const ENV = process.env.ENV || 'dev';

export const BASE_URLS = {
  // When you run locally without Docker, your native API exposes port 3000
  dev: 'http://localhost:3000', 
  qa: 'http://localhost:3001',
  
  // Names of the services and internals assigned in qa-automation-infrastructure
  staging: 'http://staging-api:3000',
  prod: 'http://localhost:3003' 
};