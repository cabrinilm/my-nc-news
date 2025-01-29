const db = require("../db/connection");

const fetchArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Bad Request" });
      } else {
        return rows[0];
      }
    });
};

const fetchArticle = (sort_by = "created_at", order = "desc") => {
  const validSortBy = ["created_at"];
  const validOrderBy = ["asc", "desc"];

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (!validOrderBy.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const queryValues = [];

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

  sqlQuery += `
GROUP by articles.article_id
ORDER BY ${sort_by} ${order};
`;
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
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
     return db.query(`SELECT 1 FROM articles WHERE article_id = $1;`, [article_id])
     .then(({rowCount}) => {
      if(rowCount === 0) {
        return Promise.reject({status: 404, message: "Article not found"});
      }
      return [];
     })
    }
  });
}

const addComment = (article_id, { username, body }) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }

  const checkArticleExistsQuery = `
    SELECT 1 FROM articles WHERE article_id = $1;
  `;

  return db
    .query(checkArticleExistsQuery, [article_id])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, message: "Article not found" });
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
        });
    });
};


const updateArticlesById = (article_id, {inc_votes}) => {
  
  if (inc_votes === undefined || typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }



  const sqlQuery =
  `
  UPDATE articles
  SET  votes =  votes + $1
  WHERE article_id = $2
  returning *;  
  `;
return db.query(sqlQuery, [inc_votes, article_id])
.then(({rows}) => {
  if(rows.length === 0){
    return Promise.reject({status: 404, message: "Article not found"});
  }
  return rows[0]
});
};


module.exports = {
  fetchArticle,
  fetchArticleById,
  fetchCommentsFromArticles,
  addComment,
  updateArticlesById
};
