import { test, expect, APIResponse } from '@playwright/test';
import type { IDataResponse, IPet, IResponseOptions } from '../types';
import { HTTP_STATUS } from '../constants/https-status';

/**
 * Validates a pets API response against the expected data.
 *
 * This helper performs a full assertion of the HTTP response, including:
 * - HTTP status code
 * - API response message
 * - API logical status
 * - Presence of a generated pet ID
 * - Partial match of the returned pet data against the expected payload
 *
 * All assertions are wrapped in a Playwright `test.step` to improve
 * test reporting and traceability.
 *
 * @param response - Playwright APIResponse returned by the pets endpoint.
 * @param expected - Expected pet data used to validate the response payload.
 * @param opts - Optional assertion overrides (statusCode, status, message).
 *
 * @throws Will fail the test if any assertion does not match.
 */
export async function verifyResponse(response: APIResponse, expected: IPet, opts?:IResponseOptions): Promise<void> {
  const message = opts?.message ?? 'pets retrived'
  const status = opts?.status ?? 'success';
  const statusCode = opts?.statusCode ?? HTTP_STATUS.CREATED;

  await test.step('validate response status code', async () => {
    expect(response.status()).toBe(statusCode);
  })

  const body = await response.json() as IDataResponse<IPet>;
  await test.step('validate response data', async () => {
    expect(body.message).toBe(message);
    expect(body.status).toBe(status);
    expect(body.data.id).toBeTruthy();
    expect(body.data).toEqual(
      expect.objectContaining({ ...expected })
    );
  });
}
