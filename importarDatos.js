const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
const fs = require('fs');

module.exports = function importar(fileDir){
    const XMLdata = fs.readFileSync(fileDir);
    const parser = new XMLParser();
    return parser.parse(XMLdata);
} 
