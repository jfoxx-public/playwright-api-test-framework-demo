// env.ts

export const ENV = process.env.ENV || 'dev';

export const BASE_URLS = {
  staging_local:  'http://localhost:4000',
  dev_local: 'http://localhost:4001', 
  
  staging: 'http://staging-api:4000',
  dev:     'http://dev-api:4001'
};

export const BASE_URL = process.env.BASE_URL || BASE_URLS[ENV as keyof typeof BASE_URLS];



