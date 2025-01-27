const express = require('express');
const app = express();

const {getTopics} = require('./controllers/topics.controllers')
const {getApiEndpoins} = require('./controllers/api.controller')
app.use(express.json())




app.get('/api', getApiEndpoins)

app.get('/api/topics', getTopics)



app.all("*", (req, res) => {
    res.status(404).send({error : "Endpoint not found"})
})




module.exports = app;