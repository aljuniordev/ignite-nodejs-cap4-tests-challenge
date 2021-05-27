import request from "supertest";
import { Connection } from "typeorm";
import {app} from  "../../../../app";
import { Router } from 'express';
import createConnection from "../../../../database";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { ensureAuthenticated } from "@shared/infra/http/middlwares/ensureAuthenticated";

let connection: Connection;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

jest.mock('', () => jest.fn((req, res, next) => next()));

describe("Test ShowUserProfileController", () => {

  beforeAll(async () => {
    connection = await createConnection();
  })

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);

    await connection.runMigrations();
  });

  it("Should be able get profile of user", async () => {
    const user = await createUserUseCase.execute({
      name: "test nome user",
      email: "test email user",
      password: "1234"
    });

    const auth = await authenticateUserUseCase.execute({
      email: "test email user",
      password: "1234"
    });

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${auth.token}`,
      })

      console.log(response.body)
    // expect(response.status).toHaveProperty("id")
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
