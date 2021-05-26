import request from "supertest";

import {app} from "../../../../app";

describe("Test CreateUserController", () => {

  it("Should be able to create user", async () => {
    await request(app).post("/api/v1/users").expect(201);
  })
});
