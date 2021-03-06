import request from "supertest";
import { Connection } from "typeorm";
import {app} from  "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Test ShowUserProfileController", () => {

  beforeAll(async () => {
    connection = await createConnection();
  })

  beforeEach(async () => {

    await connection.runMigrations();
  });

  it("Should be able get profile of user", async () => {

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

    const response = await request(app)
    .get("/api/v1/profile")
    .set({
      Authorization: `Bearer ${respAuth.body.token}`,
    });

    expect(response.body).toHaveProperty("id")
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
