import { APIRequestContext } from '@playwright/test';

export abstract class BaseClient {
  constructor(protected request: APIRequestContext) {};
};