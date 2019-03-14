/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
const dotenv = require('dotenv');
dotenv.config();
// const bodyParser = require('body-parser');
const express = require('express');
const puppeteer = require('puppeteer-core');

const app = express();

console.log("chrome", process.env.CHROME_EXE);

app.use(function forceSSL(req, res, next) {
  if (req.hostname !== 'localhost' && req.get('X-Forwarded-Proto') === 'http') {
    res.redirect(`https://${req.hostname}${req.url}`);
  }
  next();
});

app.get('/test', async (req, res, next) => {
  try {
    const browser = await puppeteer.launch({
      executablePath: process.env.CHROME_EXE,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.screenshot({path: 'public/example.png'});

    await browser.close();
    res.send('done');
  } catch (error) {
    next(error);
  }
});

app.use(express.static('public', {extensions: ['html', 'htm']}));
// app.use(express.static('node_modules'));
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
// app.use(function cors(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   // res.header('Content-Type', 'application/json;charset=utf-8');
//   // res.header('Cache-Control', 'private, max-age=300');
//   next();
// });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
