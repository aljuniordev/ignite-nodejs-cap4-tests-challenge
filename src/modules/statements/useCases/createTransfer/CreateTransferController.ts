import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

export class CreateTransferController {
  async handle(req: Request, res: Response) {
    const { user_id } = req.params;
    const recev_id = user_id as string;
    const { id: sender_id } = req.user;
    const { amount, description } = req.body;

    const createTransfer = await container.resolve(CreateTransferUseCase);

    const statement = await createTransfer.execute({
      user_id: recev_id,
      sender_id,
      amount,
      description,
    });

    return res.status(201).json(statement);
  }
}
