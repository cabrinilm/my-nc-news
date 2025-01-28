const db = require('../db/connection');
const format = require('pg-format');

const getAllTopics = () => {
  
  return db.query('SELECT * from topics')
    .then(result => {
      return result.rows; 
    });
};

module.exports = { getAllTopics };
