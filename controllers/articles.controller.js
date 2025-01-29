
const  { fetchArticle, fetchArticleById, fetchCommentsFromArticles, addComment } = require('../model/articles.model')


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
  .then(( articles ) => {
    res.status(200).send({ articles })
  })
  .catch(next);

}

const getCommentsFromArticles = (req, res, next) => {
     const { article_id } = req.params;
    return fetchCommentsFromArticles(article_id)
    .then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next)
}

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const {username, body} = req.body;

    addComment(article_id, {username, body})
  .then((comment) => {

    res.status(201).json({comment})
  })
  .catch(next)

}


module.exports =  { getArticlesById, getAllArticles, getCommentsFromArticles, postComment }