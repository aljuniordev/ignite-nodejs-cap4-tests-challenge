import request from "supertest";
import { Connection } from "typeorm";
import {app} from  "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Test AuthenticateUserController", () => {

  beforeAll(async () => {
    connection = await createConnection();
  })

  beforeEach(async () => {
    await connection.runMigrations();
  });

  it("Should be able to authenticate an user", async () => {

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

    expect(respAuth.body).toHaveProperty("token")
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
