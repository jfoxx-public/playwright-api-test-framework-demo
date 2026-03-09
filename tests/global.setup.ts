import { test as teardown } from '@playwright/test';
import Logger from '@/utils/logger';

teardown('Creating database', async ()=>{
  Logger.info('Before all -> Starting global setup...');
  Logger.info('Setting up environment');
  Logger.info('await resetDatabase();  // clean the database');
  Logger.info('await seedUsers();      // generate default users for the environment');
  Logger.info('Global setup completed.');
})