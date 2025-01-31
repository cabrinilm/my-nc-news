const db = require("../db/connection");

const fetchArticleById = (id, { comment_count }) => {
  const checkIdExist = `SELECT 1 FROM articles WHERE article_id = $1;`;

  const checkIdPromise = db.query(checkIdExist, [id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
  });

  let sqlQuery = `SELECT * FROM articles WHERE article_id=$1`;

  if (comment_count === true) {
    sqlQuery = `
      SELECT articles.*, 
             CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id
    `;
  }

  return checkIdPromise
    .then(() => {
      return db.query(sqlQuery, [id]);
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      const article = rows[0];
      return article;
    });
};

const fetchArticle = ({ sort_by = "created_at", order = "desc", topic }) => {
  const validSortBy = ["created_at", "topic"];
  const validOrderBy = ["asc", "desc"];

  if (!validSortBy.includes(sort_by) || !validOrderBy.includes(order)) {
    return Promise.reject({
      status: 400,
      message: "Bad Request - Invalid query parameters",
    });
  }

  let sqlQuery = `
    SELECT 
      articles.article_id,
      articles.author,
      articles.title,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
  `;

  const queryValues = [];

  const checkTopicExistsQuery = `SELECT 1 FROM topics WHERE slug = $1;`;

  const checkTopicPromise = topic
    ? db.query(checkTopicExistsQuery, [topic]).then(({ rowCount }) => {
        if (rowCount === 0) {
          return Promise.reject({ status: 404, message: "Topic not found" });
        }
      })
    : Promise.resolve();

  return checkTopicPromise.then(() => {
    if (topic) {
      sqlQuery += ` WHERE articles.topic = $1`;
      queryValues.push(topic);
    }

    sqlQuery += `
      GROUP BY articles.article_id
      ORDER BY ${validSortBy.includes(sort_by) ? sort_by : "created_at"} 
      ${validOrderBy.includes(order) ? order : "desc"};
    `;

    return db.query(sqlQuery, queryValues).then(({ rows }) => rows);
  });
};

const fetchCommentsFromArticles = (article_id) => {
  let sqlQuery = `
SELECT 
comment_id,
votes,
created_at,
author,
body,
article_id
FROM comments 
WHERE article_id = $1
ORDER BY created_at DESC;
`;

  return db.query(sqlQuery, [article_id]).then(({ rows }) => {
    if (rows.length > 0) {
      return rows;
    } else {
      return db
        .query(`SELECT 1 FROM articles WHERE article_id = $1;`, [article_id])
        .then(({ rowCount }) => {
          if (rowCount === 0) {
            return Promise.reject({
              status: 404,
              message: "Article not found",
            });
          }
          return [];
        });
    }
  });
};

const addComment = (article_id, { username, body }) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }

  const checkUserExistsQuery = `
        SELECT 1 FROM users WHERE username = $1;
      `;

  return db.query(checkUserExistsQuery, [username]).then(({ rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, message: "Username not found" });
    }

    const sqlQuery = `
            INSERT INTO comments (article_id, author, body)
            VALUES ($1, $2, $3)
            RETURNING comment_id, votes, created_at, author, body, article_id
          `;

    return db
      .query(sqlQuery, [article_id, username, body])
      .then(({ rows }) => {
        return rows[0];
      })
      .catch((err) => {
        if (err.code === "23503") {
          return Promise.reject({ status: 404, message: "Article not found" });
        }
        return Promise.reject(err);
      });
  });
};

const updateArticlesById = (article_id, { inc_votes }) => {
  if (inc_votes === undefined || typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }

  const sqlQuery = `
  UPDATE articles
  SET  votes =  votes + $1
  WHERE article_id = $2
  returning *;  
  `;
  return db.query(sqlQuery, [inc_votes, article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "Article not found" });
    }
    return rows[0];
  });
};

module.exports = {
  fetchArticle,
  fetchArticleById,
  fetchCommentsFromArticles,
  addComment,
  updateArticlesById,
};
