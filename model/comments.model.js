const db = require("../db/connection");

const dropComment = (comment_id) => {
  const sqlQuery = `
DELETE FROM comments
WHERE comment_id = $1;
`;

  return db.query(sqlQuery, [comment_id]).then(({ rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, message: "Comment not found" });
    }
  });
};

module.exports = { dropComment };
