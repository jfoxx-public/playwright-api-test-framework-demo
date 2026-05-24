// env.ts

export const ENV = process.env.ENV || 'dev';

export const BASE_URLS = {
  dev: 'http://localhost:3000', 
  qa: 'http://localhost:3001',
  
  staging: 'http://staging-api:3002', // internal URL for staging-api container
  prod: 'http://localhost:3003'
};

export const BASE_URL = process.env.BASE_URL || BASE_URLS[ENV as keyof typeof BASE_URLS];