
const {getEndpoints} = require('../model/api.model');


const getApiEndpoins = (req, res, next) => {
 
    getEndpoints()
    .then((endpoints) => {
        res.status(200).send({endpoints});
    })
    .catch((err) => {
        next(err)
    });


}


module.exports = {getApiEndpoins}
