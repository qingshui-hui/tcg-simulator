/* global it */

const request = require("supertest");
const assert = require("assert");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/user", function (req, res) {
  res.status(200).json({ name: "john" });
});
app.post("/user", function (req, res) {
  // console.log(req.body);
  // console.log(req.body.name);
  res.status(200).json({});
});

it("can fetch user", (done) => {
  request(app)
    .get("/user")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "15")
    .expect(200, done);
});

it("can post user", (done) => {
  const user = { name: "bob" };
  request(app)
    .post("/user")
    .set("Content-type", "application/json")
    .send(user)
    .expect(200, done);
});

const serverApp = require("@/server/index.js");
const myApp = serverApp.app;
it("can use esmodule", (done) => {
  request(myApp).get("/").expect(200, done);
});

it("can use import.meta", () => {
  import.meta.url;
});
