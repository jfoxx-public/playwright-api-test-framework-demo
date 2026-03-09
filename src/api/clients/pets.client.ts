import { APIResponse } from '@playwright/test';
import { BaseClient } from './base.client';
import type { IPet } from '../types';
import { test } from '../fixtures/api.fixture';
import { User } from '../data/user.types';

/**
 * API client responsible for interacting with the Pets endpoints.
 *
 * This class encapsulates all CRUD operations related to pets and provides
 * a clean, typed interface for API tests.
 *
 * It is designed to be used as a Playwright fixture, allowing tests to
 * focus on behavior rather than HTTP implementation details.
 */
export class PetsClient extends BaseClient {
  /**
   * Creates a new pet record.
   * @returns an APIResponse object
   */
  async create(pet: IPet, token?:string): Promise<APIResponse> {
    const endpoint = (!token)? '/pets' : '/protected/pets';
    return await test.step(`create a pet ${JSON.stringify(pet)}`, async () => {
      const opts: any = {data: pet};

      if(token){
         opts.headers = {
          Authorization: `Bearer ${token}`,
        };
      }

      return this.request.post(endpoint, opts);
    });
  }

  /**
   * Creates a new pet record
   * @returns a numeric pet id
   */
  async createAndGetId(pet: IPet): Promise<number> {
    return await test.step(`create pet and return id ${JSON.stringify(pet)}`, async () => {
      const response = await this.create(pet);
      const body = await response.json();
      return body.data.id;
    });
  }

  /**
   * Get a pet by id
   * @returns an APIResponse object
   */
  async getById(id: number): Promise<APIResponse> {
    return await test.step(`get a pet by id ${id}`, async () => {
      return this.request.get(`/pets/${id}`);
    });
  }

  /**
   * Get all pets
   * @returns an APIResponse object
   */
  async get(endpoint:string='/pets' , token?:string): Promise<APIResponse> {
    return await test.step(`get all pets`, async () => {
      return this.request.get(endpoint, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
    });
  }

  /**
   * Full pet update
   * @returns an APIResponse object
   */
  async fullUpdate(id: number, newPetData: IPet): Promise<APIResponse> {
    return await test.step(`full update pet ${id}`, async () => {
      return this.request.put(`/pets/${id}`, {
        data: newPetData,
      });
    });
  }

  /**
   * Partial pet update
   * @returns an APIResponse object
   */
  async partialUpdate(id: number, newPetData: {}): Promise<APIResponse> {
    return await test.step(`partial update pet ${id}`, async () => {
      return this.request.patch(`/pets/${id}`, {
        data: newPetData,
      });
    });
  }

  /**
   * Delete a pet
   * @returns an APIResponse object
   */
  async delete(id: number): Promise<APIResponse> {
    return await test.step(`delete a pet ${id}`, (async) => {
      return this.request.delete(`/pets/${id}`);
    });
  }

  async getBearerToken(
    user: User,
    endpoint: string = "/login",
  ): Promise<string> {
    const response =
      await test.step(`Requesting access token from ${endpoint}`, async () => {
        const res = await this.request.post(endpoint, {
          data: {
            username: user.username,
            password: user.password
          },
        });

        if (!res.ok()) {
          throw new Error(`Failed to get token. Status: ${res.status()}`);
        }
        return res;
      });

    return await test.step("Extracting bearer access token", async () => {
      const json = await response.json();

      if (!json?.data?.accessToken) {
        throw new Error(
          `Access token not found in response: ${JSON.stringify(json)}`,
        );
      }

      return json.data.accessToken;
    });
  }
}
