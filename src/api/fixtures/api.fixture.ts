import { test as base } from '@playwright/test';
import { PetsClient } from '../clients/pets.client'

/**
 * This extension eliminates the need to manually instantiate PetsClient in every test.
 * + Example:
 *    - before:
 *        const pets = new PetsClient(request); 
 *    - after:
 *        test('my test', async ({ pets }) => { ... });
 */
export const test = base.extend<{ pets: PetsClient }>({ // to enable the use of a new 'pets' fixture (similar to request, page, or browser)
  pets: async ({ request }, use) => { // provides the 'pets' fixture by wrapping 'request', eliminating the need for manual injection in every test
    await use(new PetsClient(request)); // injects PetsClient, pre-configured with the test's request context.
  },
});

export { expect } from '@playwright/test';

