const express = require("express");
const app = express();
const cors = require("cors")
app.use(cors({
  origin: '*',
}));
const { getTopics } = require("./controllers/topics.controllers");
const { getApiEndpoins } = require("./controllers/api.controller");
const { getUsers } = require("./controllers/users.controller")
const {
  getArticlesById,
  getAllArticles,
  getCommentsFromArticles,
  postComment,
  patchArticlesById
} = require("./controllers/articles.controller");
const { deleteCommentById } = require("./controllers/comments.controller")
app.use(express.json());

app.get("/api", getApiEndpoins);

app.get("/api/topics", getTopics);


app.get("/api/users",  getUsers)

app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles/:article_id/comments", getCommentsFromArticles);

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/articles/:article_id", patchArticlesById)

app.delete("/api/comments/:comment_id", deleteCommentById)




app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Bad Request - Invalid ID type" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    return res.status(err.status).send({ error: err.message });
  }
  next(err);
});

app.use((err, req, res, next) => {

  if (res.headersSent) {
    return next(err);
  }
  res.status(500).send({ error: "Internal Server Error" });
});

app.use((err, req, res, next) => {
  const message = err.message || "Something went wrong!";
  res.status(500).send({ error: message });
});

app.all("*", (req, res) => {
  res.status(404).send({ error: "Endpoint not found" });
});

module.exports = app;
