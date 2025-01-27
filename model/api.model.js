const fs = require('fs');
const path = require('path');

const getEndpoints = () => {

 return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '../endpoints.json');
    fs.readFile(filePath, 'utf-8', (err,data) => {
        if(err) {
            return reject(new Error('Failed to read the endpoint'));
        }
        resolve(JSON.parse(data));
    });
 });

};


module.exports = {getEndpoints};