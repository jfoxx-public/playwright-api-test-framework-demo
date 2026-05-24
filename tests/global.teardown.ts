import { test as teardown } from '@playwright/test';
import Logger from '@/utils/logger';

teardown('Deleting database', async ()=>{
    Logger.info('After all -> Starting global teardown...');
    Logger.info('Cleaning up environment...');
    Logger.info('await deleteDatabase();  // remove the database');
    Logger.info('await clearStorage();    // clear temporary files');
    Logger.info('Global teardown completed.');
})