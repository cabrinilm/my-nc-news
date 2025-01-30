const db = require("../db/connection");



const fetchUsers = () => {
      


    const sqlQuery = 
    `
    SELECT * FROM users;
    
    `;


    return db.query(sqlQuery)
    .then(({rows}) => {
        return rows;
    });



}


module.exports = {fetchUsers};