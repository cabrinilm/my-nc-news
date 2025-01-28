const fs = require('fs/promises');
const path = require('path');

const fetchEndpoints = () => {

 const filePath = path.join(__dirname, '../endpoints.json');
 return fs.readFile(filePath, 'utf-8')
 .then((response) => JSON.parse(response))

};


module.exports = {fetchEndpoints};