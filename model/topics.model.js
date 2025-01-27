const db = require('../db/connection');
const format = require('pg-format');

const getAllTopics = () => {
  
  return db.query('SELECT * from topics')
    .then(result => {
      return result.rows; 
    })
    .catch(err => {
      throw new Error('Error finding topics');
    });
};

module.exports = { getAllTopics };
