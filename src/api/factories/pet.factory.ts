import { IPet } from "../types";
import { faker } from "@faker-js/faker";

export class PetFactory {

static baseData(overrides: Partial<IPet> = {}): IPet {  //>  static baseData():IPet {
    return {
      name: "bingo",
      type: "dog",
      age: 1,
      ...overrides,
    };
  }

  static generate(overrides: Partial<IPet> = {}): IPet {
    return {
      name: faker.animal.petName(),
      type: faker.animal.type(),
      age: faker.number.int({ min: 2, max: 15 }),
      ...overrides,
    };
  }
}
