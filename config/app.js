const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { Client } = require('pg');

global.client = new Client({
  database: 'crud',
  user: 'sam',
  password: 'samjust'
});

const initDB = require('../utils/initDatabase');

global.client.connect().then(() => {
  console.log('Connection established');
  // initDB();
}).catch(err => {
  console.log('Error connecting to database');
  console.error(err);
});

const app = express();

const jsonBodyParser = bodyParser.json({});

app.use(cookieParser());
app.use(jsonBodyParser);

const postsRouter = require('../routes/postsRouter');
app.use('/posts', postsRouter);

app.use('*', (req, res) => {
  res.sendStatus(404);
});

module.exports = app;