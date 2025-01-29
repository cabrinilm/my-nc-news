const { dropComment } = require("../model/comments.model")


const deleteCommentById = (req, res, next) => {
 const {comment_id } = req.params; 
 return dropComment(comment_id)
 .then(() => {
    res.status(204).send()
 })
 .catch(next)



}



module.exports = { deleteCommentById };