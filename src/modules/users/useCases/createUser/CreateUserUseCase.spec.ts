import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Test AuthenticateUser", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it ("Should be able to create a new user", async () => {
    const passwordHash = await hash("1234", 8);

    const newUser = await createUserUseCase.execute({
      name: "test nome user",
      email: "test email user",
      password: passwordHash
    });

    expect(newUser).toHaveProperty('id');

  });

  it ("Should not be able to create a new user with eixists email", async () => {

    expect(async () => {
      const passwordHash = await hash("1234", 8);

      const newUser1 = await createUserUseCase.execute({
        name: "test nome user",
        email: "test email user",
        password: passwordHash
      });

      const newUser2 = await createUserUseCase.execute({
        name: "test nome user 2",
        email: "test email user",
        password: passwordHash
      });
    }).rejects.toBeInstanceOf(CreateUserError);

  });

});
