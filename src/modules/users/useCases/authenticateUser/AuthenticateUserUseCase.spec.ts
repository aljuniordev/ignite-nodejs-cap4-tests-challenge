import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ShowUserProfileUseCase } from '../showUserProfile/ShowUserProfileUseCase';
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Test AuthenticateUser", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should not be authenticate an user with wrong email", async () => {
    expect(async () => {
      const newUser = await createUserUseCase.execute({
        name: "test nome user",
        email: "test email user",
        password: "1234"
      });

      const auth = await authenticateUserUseCase.execute({
        email: "test email user 111",
        password: "1234"
      });

    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be authenticate an user with wrong password", async () => {
    expect(async () => {
      const newUser = await createUserUseCase.execute({
        name: "test nome user",
        email: "test email user",
        password: "1234"
      });

      const auth = await authenticateUserUseCase.execute({
        email: "test email user",
        password: "123456"
      });

    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should be authenticate an user", async () => {
    const newUser = await createUserUseCase.execute({
      name: "test nome user",
      email: "test email user",
      password: "1234"
    });

    const auth = await authenticateUserUseCase.execute({
      email: "test email user",
      password: "1234"
    });

    expect(auth).toHaveProperty("token");
  });
});
