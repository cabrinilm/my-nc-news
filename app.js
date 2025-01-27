const express = require('express');
const app = express();
const endpointsJson = require('./endpoints.json')


app.use(express.json())





app.get('/api', (req, res, next) => {
    res.status(200).send({ endpoints: endpointsJson });
  });










module.exports = app;