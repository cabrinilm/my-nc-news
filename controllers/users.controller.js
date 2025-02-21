const { fetchUsers,insertUser } = require("../model/users.model");

const getUsers = (req, res, next) => {
  return fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};


const createUser = (req, res, next) => {
  const { username, name, avatar_url } = req.body;
  
 
  
  if (!username || !name) {
    return res.status(400).send({ error: "Username and name are required" });
  }

  insertUser(username, name, avatar_url)
    .then(user => {
     
      res.status(201).send({ user : user.rows[0]});
    })
    .catch(next);
};

module.exports = { getUsers, createUser };


