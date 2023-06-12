const express = require('express');

const path = require('path');

const app = express();

const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const proxy = require('http-proxy-middleware');

app.use(express.static('public'));

const apiProxyTarget = process.env.API_PROXY_TARGET;
if (apiProxyTarget) {
  app.use('/graphql', proxy({ target: apiProxyTarget }));
}

const UI_API_ENDPOINT = process.env.UI_API_ENDPOINT || 'http://localhost:3000/graphql';

const env = { UI_API_ENDPOINT };

app.get('/env.js', (req, res) => {
  res.send(`window.ENV = ${JSON.stringify(env)}`);
});

const SERVER_PORT_UI = process.env.SERVER_PORT_UI || 8000;

app.listen(8000, () => {
  console.log(`UI started on port ${SERVER_PORT_UI}`);
});
