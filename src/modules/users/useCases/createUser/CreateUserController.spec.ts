import request from "supertest";
import { Connection } from "typeorm";
import {app} from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Test CreateUserController", () => {

  beforeAll(async () => {
    connection = await createConnection();
  })

  beforeEach(async () => {
    await connection.runMigrations();
  });

  it("Should be able to create user", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .send({
        name: "name test",
        email: "email test",
        password: "password test"
      });
      //caso tivese token
      // .set({
      //   Authorization: `Bearer ${token}`,
      // });

    expect(response.status).toBe(201);
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

});
