const db = require("../db/connection");

const fetchUsers = () => {
  const sqlQuery = `
    SELECT * FROM users;
    
    `;

  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};
const insertUser = (username, name, avatar_url) => {
  const query = `
    INSERT INTO users (username, name, avatar_url) 
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [username, name, avatar_url];
  return db.query(query, values);
};



module.exports = { fetchUsers, insertUser };
