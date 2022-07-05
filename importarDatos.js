const fs = require('fs');
var parser = require('xml2json');

module.exports = function importar(fileDir){
    const XMLdata = fs.readFileSync(fileDir);
    const jsonData = parser.toJson(XMLdata);
    return JSON.parse(jsonData)
} 
