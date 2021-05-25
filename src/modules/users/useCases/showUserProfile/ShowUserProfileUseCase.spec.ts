import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Test ShowUserProfileUseCase", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it ("should not be able show profiles with nonexists user_id ", async () => {

    expect( async () => {
      const user_id = "1234";

      const list = await showUserProfileUseCase.execute(user_id);
    }).rejects.toBeInstanceOf(ShowUserProfileError);

  });

  it ("should be able to show profiles", async () => {

    const passwordHash = await hash("1234", 8);

    const newUser = await createUserUseCase.execute({
      name: "test nome user",
      email: "test email user",
      password: passwordHash
    });

    const user_id = newUser.id as string;

    const ret = await showUserProfileUseCase.execute(user_id);

    expect(ret).toBeTruthy();

  });

});
