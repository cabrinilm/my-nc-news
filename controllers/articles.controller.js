const  { articleById } = require('../model/articles.model')


const getArticlesById = (req, res, next) => {
    const { article_id } = req.params;
    return articleById(article_id)
    .then((article) => {
    
        res.status(200).send({article})
    })
    .catch(next);


};




module.exports =  { getArticlesById }