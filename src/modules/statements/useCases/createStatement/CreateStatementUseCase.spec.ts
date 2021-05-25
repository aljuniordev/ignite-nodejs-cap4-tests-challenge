import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Test CreateStatement", () => {

  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  });

  it("should not be able to create a new statement with nonexists user", () => {

    expect( async () => {
      const statement1 = await createStatementUseCase.execute({
        user_id: "1234",
        type: "deposit" as OperationType,
        amount: 100,
        description: ""
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should be able to create a new statement deposit", async () => {

    const newUser = await createUserUseCase.execute({
      name: "test nome user",
      email: "test email user",
      password: "1234"
    });

    const statement1 = await createStatementUseCase.execute({
      user_id: newUser.id as string,
      type: "deposit" as OperationType,
      amount: 100,
      description: ""
    });

    expect(statement1).toHaveProperty("id");
  });

  it("should not be able to create a new statement withdraw without funds", async () => {
    expect( async () => {
      const newUser = await createUserUseCase.execute({
        name: "test nome user",
        email: "test email user",
        password: "1234"
      });

      const user_id = newUser.id as string;

      const statement1 = await createStatementUseCase.execute({
        user_id,
        type: "deposit" as OperationType,
        amount: 40,
        description: ""
      });

      const statement2 = await createStatementUseCase.execute({
        user_id,
        type: "withdraw" as OperationType,
        amount: 50,
        description: ""
      });

      }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should be able to create a new statement withdraw with funds", async () => {

    const newUser = await createUserUseCase.execute({
      name: "test nome user",
      email: "test email user",
      password: "1234"
    });

    const statement1 = await createStatementUseCase.execute({
      user_id: newUser.id as string,
      type: "deposit" as OperationType,
      amount: 50,
      description: ""
    });

    const statement2 = await createStatementUseCase.execute({
      user_id: newUser.id as string,
      type: "withdraw" as OperationType,
      amount: 40,
      description: ""
    });

    expect(statement2).toHaveProperty("id");
  });
});
