
const  { fetchArticle, fetchArticleById } = require('../model/articles.model')


const getArticlesById = (req, res, next) => {
    const { article_id } = req.params;
    return fetchArticleById(article_id)
    .then((articles) => {
    
        res.status(200).send({articles})
    })
    .catch(next);


};

const getAllArticles = (req, res, next) => {

  return fetchArticle()
  .then((articles ) => {
    res.status(200).send({ articles })
  })
  .catch(next);

}



module.exports =  { getArticlesById, getAllArticles }