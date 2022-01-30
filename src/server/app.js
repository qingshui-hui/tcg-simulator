// これによりほぼcjsの構文で、部分的にejsのimportが使える。
import { createRequire } from 'module'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const require = createRequire(import.meta.url);

const __dirname = dirname(fileURLToPath(import.meta.url));
// 2階層上がルートディレクトリ
const root = __dirname.split('/').slice(0, -2).join('/')
const filepath = root + '/dist'

const express = require('express');
const app = express();
app.use(express.static(filepath))

// cors
if (process.env.CLIENT_ORIGIN) {
  const cors = require('cors')
  // 全てのクロスオリジンリクエストを許可する。
  app.use(cors())
}

app.get('/', function (req, res) {
  res.sendFile(filepath + '/index.html');
});
// /roomへの直接アクセスを許可する。
app.get('/room', function (req, res) {
  res.sendFile(filepath + '/index.html');
});
app.get('/builder', function (req, res) {
  res.sendFile(filepath + '/index.html');
});

import apiRouter from './api.js'
app.use(apiRouter)

const server = require('http').createServer(app);

export {
  app,
  server,
}
