import { IPet, IResponseOptions } from './../../src/api/types/api.types';
import { HTTP_STATUS } from "@/api/constants/https-status";
import { expect, test } from "@/api/fixtures/api.fixture";
import { users } from "@/api/data/users";
import { verifyResponse } from "@/api/assertions/pets.assertions";

test("should do a basic login", async ({ request }) => {
  const response =
    await test.step("Attempting basic authentication...(credentials are send in base64 format)", async () => {
      const {username, password} = users.admin;
      const account = `${username}:${password}`;
      return await request.get("/protected-basic", {
        headers: { Authorization: `Basic ${btoa(account)}` },
      });
    });

  await test.step("Verify successful authentication response", async () => {
    const expectedText = "Hello admin, you have accessed a protected endpoint!";
    expect(response.status()).toEqual(HTTP_STATUS.OK)
    expect(await response.text()).toBe(expectedText);
  });
});

test("should do a bearer authentication", async ({ pets }) => {
  //
  // authentication token
  const token = await test.step("Requesting access token from /login", async () => {
    return await pets.getBearerToken(users.automation);
  });

  //
  // accessing protected endpoint
  const bearerResponse =
  await test.step("Accessing protected endpoint with Bearer token", async () => {
    const protectedEndpoint = '/protected-bearer'
    return pets.get(protectedEndpoint, token);
  });

  //
  // verify protected endpoint response
  await test.step("Verify protected endpoint response status and body", async () => {
    const expectedStatus = HTTP_STATUS.OK;
    expect(bearerResponse.status()).toBe(expectedStatus);
    const protectedEndpointMessage = "Hello automation, you have accessed a protected endpoint!";
    expect(await bearerResponse.text()).toBe(protectedEndpointMessage);
  });
});

test("should create a protected pet", async ({ pets }) => {
  const petData = {
    name: "protected-bingo",
    type: "dog",
    age: 1,
  } as IPet;

  const expectedPetData = petData;

  const expectedOpts = {
    statusCode: HTTP_STATUS.CREATED,
    status: "success",
    message: "Pet created",
  } as IResponseOptions;

  //
  // authentication token
  const token =
    await test.step("Requesting access token from /login", async () => {
      return pets.getBearerToken(users.automation);
    });

  //
  // sending payload to protected endpoint
  const bearerResponse =
    await test.step("Creating a pet on a protected endpoint", async () => {
      return pets.create(petData, token);
    });

  await test.step("Verify pet was successfully created on a protected endpoint", async () => {
    verifyResponse(bearerResponse, expectedPetData, expectedOpts);
  });
});