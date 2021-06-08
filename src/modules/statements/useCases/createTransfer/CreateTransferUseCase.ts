import { inject, injectable } from "tsyringe";
import { Statement } from "@modules/statements/entities/Statement";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { OperationType } from "@modules/statements/entities/OperationType";
import { ICreateTransferStatementDTO } from "./ICreateTransferStatementDTO";

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    user_id,
    sender_id,
    amount,
    description,
  }: ICreateTransferStatementDTO): Promise<Statement> {
    const userSender = await this.usersRepository.findById(sender_id);
    if (!userSender) {
      throw new CreateStatementError.UserNotFound();
    }

    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new CreateStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
    });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds();
    }

    const statementOperationWithdraw = await this.statementsRepository.create({
      user_id: sender_id,
      type: "withdraw" as OperationType,
      amount,
      description: "Transferência para " + user.name + " - " + description,
    });

    const statementOperationDeposit = await this.statementsRepository.create({
      user_id,
      type: "deposit" as OperationType,
      amount,
      description: "Transferência de " + userSender.name + " - " + description,
    });

    return statementOperationWithdraw;
  }
}
