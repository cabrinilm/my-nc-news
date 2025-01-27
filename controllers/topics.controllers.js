const { getAllTopics } = require("../model/topics.model");

const getTopics = (req, res, next) => {
  getAllTopics()
  .then((topics) => {
      return res.status(200).send({ topics });
    })
    .catch(next);
};

module.exports = {getTopics};
