
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import {GetBalanceUseCase} from "./GetBalanceUseCase";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Test GetBalanceUseCase", () => {

  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be to get balance of an user", async () => {
    const user = await createUserUseCase.execute({
      name: "test nome user",
      email: "test email user",
      password: "1234"
    });

    const user_id = user.id as string;

    const balance = await getBalanceUseCase.execute({user_id});

    // console.log(balance);
  });

})
