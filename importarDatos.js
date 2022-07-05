const fs = require('fs');
var parser = require('xml2json');

const importar = function importar(fileDir){
    const XMLdata = fs.readFileSync(fileDir);
    const jsonData = parser.toJson(XMLdata);
    return JSON.parse(jsonData)
} 

const guardarResultado = function guardarResultado(resultado){
    fs.writeFileSync("resultado.txt", `Costo Total: ${resultado[1]}, Solucion: ${resultado[0]}`)
}

module.exports = {importar, guardarResultado}