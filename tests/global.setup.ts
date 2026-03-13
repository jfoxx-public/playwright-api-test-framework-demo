import { test as teardown } from '@playwright/test';
import Logger from '@/utils/logger';
import { currentEnv } from '@/api/data/users';

teardown('Creating database', async ()=>{
  Logger.info('Before all -> Starting global setup...');
  Logger.info(`Setting up environment ("${currentEnv.toUpperCase()}")`);
  Logger.info('await resetDatabase();  // clean the database');
  Logger.info('await seedUsers();      // generate default users for the environment');
  Logger.info('Global setup completed.');
})