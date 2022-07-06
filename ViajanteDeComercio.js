const {importar, guardarResultado} = require('./importarDatos')

function grasp(fileDir, iteraciones){// O(n³ * log n)
	const datos = importar(fileDir)
	const vertices = []
	let aristas = []
	datos.travellingSalesmanProblemInstance.graph.vertex.forEach((e, i) => {
		vertices.push(i)
		aristas = aristas.concat(e.edge.map(e => {return {peso: parseFloat(e.cost), verticeOrigen: i, verticeDestino: parseInt(e['$t'])}}))
	})
	const matrizCompleta = floyd(vertices, aristas) 
	let iteracionActual = 0
	let mejorSolucion = BusquedaLocal(ViajanteDeComercio(vertices.map(i => {return {visitado: false, numero: i}}), matrizCompleta), matrizCompleta)
	while(iteracionActual < iteraciones){// O(n³ * log n)
		const solucionActual = BusquedaLocal(ViajanteDeComercio(vertices.map(i => {return {visitado: false, numero: i}}), matrizCompleta), matrizCompleta)
		if(mejorSolucion[1] > solucionActual[1]){
			mejorSolucion = solucionActual
			console.log(mejorSolucion[1], iteracionActual)
		}
		iteracionActual++
	}
	guardarResultado(mejorSolucion)
}

function ViajanteDeComercio(v, matrizCompleta){ // O(n² * log n)
	let actual = v[Math.floor(Math.random() * (v.length))]
	const res = []
	res.push(actual.numero)
	actual.visitado = true
	let visitados = 1
	while(visitados < v.length){ // O(n² * log n)
		const adyacentes = [...Array(v.length).keys()].filter(ady => !v[ady].visitado).sort((a, b) => matrizCompleta[a][actual.numero] - matrizCompleta[b][actual.numero]) // O(n * log n)
		const siguiente = obtenerRandom(adyacentes, v)
		// console.log("actual", actual.numero)
		// console.log("siguiente", siguiente.numero, )
		// console.log("posibilidades: ", adyacentes.map(it => {return {peso: matrizCompleta[actual.numero][it], numero: it}}))
		res.push(siguiente.numero)
		siguiente.visitado = true
		visitados++
		actual = siguiente
	}
	return res
}

function obtenerRandom(adyacentes, v){ // O(1)
	const randomInt = Math.floor(
		Math.random() * (adyacentes.length / (adyacentes.length < 10 ? 2 : 10)) // devuelve un numero entre los 10% primeros es decir 10 de 100.
	)																			// En caso que la cantidad de adyacentes sea menor a 10 devuelve un numero random entre 0 y la mitad de la cantidad de adyacentes
	return v[adyacentes[randomInt]]
}

function BusquedaLocal(solucion, matrizCompleta){ // O(n)
	let vecindarioPeor = false
	let solucionActual = [solucion, costo(solucion, matrizCompleta)]
	while(!vecindarioPeor){ // O(n²)
		let mejorSolucionVecindario = solucionActual
		for (let i = 0; i < solucion.length; i++) { // 0(n)
			const nodoSiguiente = (i + 1) % solucion.length
			const costoNuevo = costoAlIntercambiar(i, nodoSiguiente, solucionActual, matrizCompleta)
			if(costoNuevo < mejorSolucionVecindario[1]){
				mejorSolucionVecindario = [swap(i, nodoSiguiente, [...solucionActual[0]]), costoNuevo]
			}
		}
		if(!mejoro(solucionActual[1], mejorSolucionVecindario[1])){
			if(solucionActual[1] > mejorSolucionVecindario[1]){
				solucionActual = mejorSolucionVecindario
			}
			vecindarioPeor = true
		} else {
			solucionActual = mejorSolucionVecindario
		}
	}
	return solucionActual
}

function mejoro(costoActual, costoNuevo){ // O(1) retorna true si la solucion nueva es mejor en un 5% o mas
	const mejoraEsperada = (costoActual * 2) / 100
	return (costoActual - costoNuevo) >= mejoraEsperada
}

function swap(i, j, solucion){ //O(1)
	const tmp = solucion[i]
	solucion[i] = solucion[j]
	solucion[j] = tmp
	return solucion
}

function costo(solucion, matrizCompleta){ // O(n)
	let costoTotal = 0 
	for (let i = 0; i < solucion.length; i++) {
		const costoActual = matrizCompleta[solucion[i]][solucion[(i + 1) % solucion.length]]
		costoTotal += costoActual
	}
	return costoTotal
}

function costoAlIntercambiar(i, j, solucionCosto, matrizCompleta){ // O(1)
	const solucionActual = solucionCosto[0]
	const costoActual = solucionCosto[1]
	const nodoAnterior = solucionActual[mod(i - 1, solucionActual.length)]
	const nodoSiguiente = solucionActual[(j + 1) % solucionActual.length]
	const costo1 = matrizCompleta[nodoAnterior][solucionActual[j]] - matrizCompleta[nodoAnterior][solucionActual[i]]
	const costo2 = matrizCompleta[solucionActual[i]][nodoSiguiente] - matrizCompleta[solucionActual[j]][nodoSiguiente]
	return costoActual + costo1 + costo2
}
function mod(n, m) { // O(1) usado debido a que el operador % en javascript no funciona con numeros negativos
	return ((n % m) + m) % m;
}

function floyd(vertices, aristas) { // O(n³)
	let dist = {};
	for (let i = 0; i < vertices.length; i++) {
		dist[vertices[i]] = {};
		aristas.filter(a => a.verticeOrigen == i).forEach(a => (dist[vertices[i]][a.verticeDestino] = a.peso));
		aristas.filter(a => a.verticeDestino == i).forEach(a => (dist[vertices[i]][a.verticeOrigen] = a.peso));
		vertices.forEach(n => {
			if (dist[vertices[i]][n] == undefined){
				dist[vertices[i]][n] = Infinity;
			}
			if (vertices[i] === n){
				dist[vertices[i]][n] = 0
			};
		});
	}
	vertices.forEach(i => {
	   vertices.forEach(j => {
			vertices.forEach(k => {
				if (dist[i][k] + dist[k][j] < dist[i][j]){
					dist[i][j] = dist[i][k] + dist[k][j];
				}
			});
		});
	});
	return Object.keys(dist).map(v => Object.values(dist[v]));
 }

// const grafo = [{visitado: false, adyacentes: [1, 2, 3, 4, 5], numero: 0}, {visitado: false, adyacentes: [0, 2, 3, 4, 5], numero: 1}, {visitado: false, numero: 2, adyacentes: [0, 1, 3, 4, 5]}, {visitado: false, numero: 3, adyacentes: [0, 1, 2, 4, 5]}, {visitado: false, adyacentes: [0, 1, 2, 3, 5], numero: 4},
// 			   {visitado: false, adyacentes: [0, 1, 2, 3, 4], numero: 5}]
// const matriz =  [ 
// 					[0, 6, 5, 4, 5, 3],
// 				  	[6, 0, 1, 2, 4, 1], 
// 				  	[5, 1, 0, 3, 2, 6], 
// 				  	[4, 2, 3, 0, 1, 5],
// 					[5, 4, 2, 1, 0, 3],
// 					[3, 1, 6, 5, 3, 0]
// 				]
// const res = ViajanteDeComercio(grafo, matriz)
// const resBusqueda = BusquedaLocal([...res], matriz)

// const vertices = [0, 1, 2, 3, 4]
// const matriz =  [ 
// 					[0, 4, 5, -1, 8],
// 					[4, 0, 1, 6, -1],
// 					[5, 1, 0, -1, 3],
// 					[-1, 6,-1, 0, 2],
// 					[8, -1, 3, 2, 0],
// 				]
// const aristas = [{verticeOrigen: 0, verticeDestino: 2, peso: 5}, {verticeOrigen: 0, verticeDestino: 4, peso: 8}, {verticeOrigen: 2, verticeDestino: 4, peso: 3}, {verticeOrigen: 1, verticeDestino: 2, peso: 1}, 
// 				 {verticeOrigen: 1, verticeDestino: 0, peso: 4}, {verticeOrigen: 3, verticeDestino: 4, peso: 2}, {verticeOrigen: 3, verticeDestino: 1, peso: 6}]
// console.log(floyd(vertices, aristas))
// importar('./grafos/att48.xml')
grasp('./grafos/gr17.xml', 1000)