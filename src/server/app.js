import { dirname } from "path";
import { fileURLToPath } from "url";

const filedir =
  typeof exports === "object"
    ? __dirname
    : dirname(fileURLToPath(import.meta.url));

// 2階層上がルートディレクトリ
const root = filedir.split("/").slice(0, -2).join("/");
const filepath = root + "/dist";

import express from "express";
import cors from "cors";
const app = express();
app.use(express.static(filepath));

// cors
if (process.env.CLIENT_ORIGIN) {
  // 全てのクロスオリジンリクエストを許可する。
  app.use(cors());
}

// bodyParser
import bodyParser from "body-parser";
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", function (req, res) {
  res.sendFile(filepath + "/index.html");
});
// /roomへの直接アクセスを許可する。
app.get("/room", function (req, res) {
  res.sendFile(filepath + "/index.html");
});
app.get("/builder", function (req, res) {
  res.sendFile(filepath + "/index.html");
});
app.get("/about", function (req, res) {
  res.sendFile(filepath + "/index.html");
});

import apiRouter from "./api.js";
app.use(apiRouter);

import http from "http";
const server = http.createServer(app);

export { app, server };
