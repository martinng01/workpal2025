import request from "supertest";
import { app } from "../app";
import { describe, it } from "@jest/globals";

describe("POST /api/register", () => {
  it("should register the students", async () => {
    return request(app)
      .post("/api/register")
      .send({
        teacher: "teacherken@gmail.com",
        students: ["studentjon@gmail.com", "studenthon@gmail.com"],
      })
      .expect(204);
  });

  it("should throw an error if the teacher does not exist", async () => {
    return request(app)
      .post("/api/register")
      .send({
        teacher: "teacherben@gmail.com",
        students: ["studentjon@gmail.com", "studenthon@gmail.com"],
      })
      .expect(404);
  });

  it("should throw an error if the student does not exist", async () => {
    return request(app)
      .post("/api/register")
      .send({
        teacher: "teacherken@gmail.com",
        students: ["studentbon@gmail.com"],
      })
      .expect(404);
  });

  it("should return a 400 error if the request body is missing the teacher field", async () => {
    return request(app)
      .post("/api/register")
      .send({
        students: ["studentjon@gmail.com", "studenthon@gmail.com"],
      })
      .expect(400);
  });

  it("should return a 400 error if the request body is missing the students field", async () => {
    return request(app)
      .post("/api/register")
      .send({
        teacher: "teacherken@gmail.com",
      })
      .expect(400);
  });

  it("should return a 400 error if the teacher email is in an invalid format", async () => {
    return request(app)
      .post("/api/register")
      .send({
        teacher: "invalidemail",
        students: ["studentjon@gmail.com"],
      })
      .expect(400);
  });

  it("should return a 400 error if any student email is in an invalid format", async () => {
    return request(app)
      .post("/api/register")
      .send({
        teacher: "teacherken@gmail.com",
        students: ["invalidemail"],
      })
      .expect(400);
  });
});
