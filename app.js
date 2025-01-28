const express = require('express');
const app = express();

const { getTopics } = require('./controllers/topics.controllers')
const { getApiEndpoins } = require('./controllers/api.controller')
const { getArticlesById } = require('./controllers/articles.controller')
app.use(express.json())




app.get('/api', getApiEndpoins)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticlesById)



app.all("*", (req, res) => {
    res.status(404).send({error : "Endpoint not found"})
})




  app.use((err, req, res, next) => {
    if (err.message === 'Invalid type of ID') {
      return res.status(400).send({ error: 'Invalid type of ID' });
    }
    next(err);  
  });



app.use((err, req, res, next) => {
    if (err.message === "Article not found") {
      res.status(404).send({ error: "Article not found" });
    } else {
      next(err);
    }
  });


app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    res.status(status).send({msg: message})
});



module.exports = app;