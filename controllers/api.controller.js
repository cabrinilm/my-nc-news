
const {fetchEndpoints} = require('../model/api.model');


const getApiEndpoins = (req, res, next) => {
 
    fetchEndpoints()
    .then((endpoints) => {
        res.status(200).send({endpoints});
    })
    .catch((err) => {
        next(err)
    });


}


module.exports = {getApiEndpoins}
