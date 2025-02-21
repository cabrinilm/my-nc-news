const { fetchUsers } = require("../model/users.model");

const getUsers = (req, res, next) => {
  return fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};


const createUser = (req, res, next) => {

  const { username } = req.body;
  
  if(!username) {

    return res.status(400).send({ error:"Insert name user please"});

  }
  return Promise.resolve()
  .then(() => {
    res.status(201).send({message: "User created with sucess"});
  })
 .catch(next)


}


module.exports = { getUsers, createUser };


