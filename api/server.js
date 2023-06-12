const express = require('express');

const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const { connectToDb } = require('./db');

const { installHandler } = require('./api_handler');

const {
  SERVER_PORT_API,
} = process.env;

const app = express();

installHandler(app);

const port = SERVER_PORT_API || 3000;

(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API server started on port ${port}`);
    });
  } catch (err) {
    console.log('Error: ', err);
  }
}());
