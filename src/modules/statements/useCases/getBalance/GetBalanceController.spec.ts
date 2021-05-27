import request from "supertest";
import { Connection } from "typeorm";
import {app} from  "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Test GetBalanceController", () => {

  beforeAll(async () => {
    connection = await createConnection();
  })

  beforeEach(async () => {
    await connection.runMigrations();
  });

  it("Should be able to get balance of user", async () => {

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

    const resBalance = await request(app)
    .get("/api/v1/statements/balance")
    .set({
      Authorization: `Bearer ${respAuth.body.token}`,
    });

    expect(resBalance.body).toHaveProperty("balance", 100);
  });


  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
