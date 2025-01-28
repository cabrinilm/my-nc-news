const db = require("../db/connection");

const articleById = (id) => {
 
    if(isNaN(id)){
        return Promise.reject({status: 400, message: 'Invalid type of ID'})
    }


  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ message: "Article not found" });
      } else {
        return rows[0];
      }
    });
};

module.exports = { articleById };
