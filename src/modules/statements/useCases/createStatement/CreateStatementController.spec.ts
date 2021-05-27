import request from "supertest";
import { Connection } from "typeorm";
import {app} from  "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Test CreateStatementController", () => {

  beforeAll(async () => {
    connection = await createConnection();
  })

  beforeEach(async () => {
    await connection.runMigrations();
  });

  it("Should be able to deposit a transaction", async () => {

    const respUser = await request(app)
      .post("/api/v1/users")
      .send({
        name: "name test",
        email: "email test",
        password: "1234"
      });

    const respAuth = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "email test",
      password: "1234"
    });

    const resStatement = await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: ""
    })
    .set({
      Authorization: `Bearer ${respAuth.body.token}`,
    });

    expect(resStatement.body).toHaveProperty("id");
  });

  it("Should be able to withdraw a transaction", async () => {

    const respUser = await request(app)
      .post("/api/v1/users")
      .send({
        name: "name test",
        email: "email test",
        password: "1234"
      });

    const respAuth = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "email test",
      password: "1234"
    });

    const resStatement = await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 100,
      description: ""
    })
    .set({
      Authorization: `Bearer ${respAuth.body.token}`,
    });

    expect(resStatement.body).toHaveProperty("id");
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
