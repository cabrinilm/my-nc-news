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


app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    res.status(status).send({msg: message})
})

module.exports = app;