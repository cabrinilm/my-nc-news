const db = require("../db/connection");

const fetchArticleById = (id) => {
 
  


  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg : 'Bad Request'});
      } else {
        return rows[0];
      }
    });
};



const fetchArticle = ( sort_by = "created_at", order = 'desc') => {

 const validSortBy = ["created_at"]
 const validOrderBy = ["asc", "desc"]
 
 if (!validSortBy.includes(sort_by)){
  return Promise.reject({ status: 400, msg: "Bad Request" })
}


if (!validOrderBy.includes(order)){
  return Promise.reject({ status: 400, msg: "Bad Request" })
}
const queryValues = []

let sqlQuery =  `
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
`



sqlQuery += 
`
GROUP by articles.article_id
ORDER BY ${sort_by} ${order};
`
return db
.query(sqlQuery, queryValues).then(({rows}) => {
 
  return rows
});

};

module.exports = { fetchArticle, fetchArticleById  } 
