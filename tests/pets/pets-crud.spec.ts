import { test, expect } from 'src/api/fixtures/api.fixture'
import { verifyResponse } from '@/api/assertions/pets.assertions';
import { HTTP_STATUS } from '@/api/constants/https-status';
import { PetFactory } from '@/api/factories/pet.factory';
import type { IPet, IResponseOptions } from '@/api/types';
import { RESPONSE_STATUS } from '@/api/constants/response-status';

test("should create a new pet", async ({ pets }) => {
  const basePetData = PetFactory.baseData();
  const responseOpts = {
    message: "Pet created",
    statusCode: HTTP_STATUS.CREATED
  } as IResponseOptions;

  const response = await pets.create(basePetData);
  await verifyResponse(response, basePetData, responseOpts);
});

test("should update a pet", async ({ pets }) => {
  //
  // test prerequisites
  //
  const basePetData = PetFactory.baseData();
  const petId = await pets.createAndGetId(basePetData);
  //
  // test scenario: update a pet (send the same initial payload but updates a single value ("age" in this case))
  // 
  const newFullPetData = PetFactory.baseData({ age: 11 }); 
  const expectedPetData = newFullPetData;
  const expectedOpts = {message: 'Pet updated', statusCode: HTTP_STATUS.OK} as IResponseOptions;

  const response = await pets.fullUpdate(petId, newFullPetData);
  await verifyResponse(response, expectedPetData, expectedOpts);
});

test("should update partially a pet", async ({ pets }) => {
  //
  // test prerequisites
  //
  let basePetData = PetFactory.baseData();
  const newPetId = await pets.createAndGetId(basePetData);
  //
  // test scenario: update a pet partially
  //
  const petValueToReplace = {
    age: 5,
  };
  
  const expectedPetData = {
    ...basePetData,
    ...petValueToReplace
  } as IPet;
  
  const expectedOpts = {
    status: RESPONSE_STATUS.SUCCESS,
    statusCode: HTTP_STATUS.OK,
    message: "Pet updated successfully"
  } as IResponseOptions;
  
  const response = await pets.partialUpdate(newPetId, petValueToReplace)
  await verifyResponse(response, expectedPetData, expectedOpts);
});

test("should delete a pet", async ({ pets }) => {
  //
  // test prerequisites
  //
  const basePetData = PetFactory.baseData();
  const newPetId = await pets.createAndGetId(basePetData);
  //
  // test scenario: delete a pet
  //
  const expectedDeleteCode = HTTP_STATUS.NO_CONTENT;
  const notFoundCode = HTTP_STATUS.NOT_FOUND;

  const deleteResponse = await pets.delete(newPetId);
  expect(deleteResponse.status()).toBe(expectedDeleteCode); // verify status code for delete request is valid
  const getPetesponse = await pets.getById(newPetId);
  expect(getPetesponse.status()).toBe(notFoundCode); // verify the pet was successfully deleted
});

test("should get a pet by id", async ({ pets }) => {
  //
  // test prerequisites
  //
  const basePetData:IPet = PetFactory.baseData();
  const newPetId = await pets.createAndGetId(basePetData);
  //
  // get a pet by id
  //
  const expectedPetData = basePetData;
  const expectedOpts = {
    status: RESPONSE_STATUS.SUCCESS,
    statusCode: HTTP_STATUS.OK,
    message: "Pet found",
  } as IResponseOptions;

  const response = await pets.getById(newPetId)
  await verifyResponse(response, expectedPetData, expectedOpts)
});

test("should get all pets", async ({ pets }) => {
  const petResponse = await pets.get();

  const body = await petResponse.json();
  // verify status and base structure
  expect(petResponse.status()).toBe(HTTP_STATUS.OK);
  expect(body).toHaveProperty("data");
  expect(Array.isArray(body.data)).toBe(true);
  expect(body.data.length).toBeGreaterThan(0);
  // verify all the elements within the "data" array
  for (const pet of body.data) {
    expect(pet).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      type: expect.any(String),
      age: expect.any(Number),
    });
  }
});
