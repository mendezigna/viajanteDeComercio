function ViajanteDeComercio(v, matrizCompleta){
	const actual = v[0]
	const res = []
	res.push(actual.numero)
	actual.visitado = true
	let visitados = 1
	while(visitados < v.length){
		const adyacentes = actual.adyacentes.filter(ady => !v[ady].visitado).sort((a, b) => matrizCompleta[a][actual.numero] - matrizCompleta[b][actual.numero]) // O(n * log n)
		const siguiente = obtenerRandom(adyacentes, v)
		res.push(siguiente.numero)
		siguiente.visitado = true
		visitados++
	}
	return res
}

function obtenerRandom(adyacentes, v){ // O(1)
	const randomInt = Math.floor(
		Math.random() * (adyacentes.length / (adyacentes.length < 10 ? 2 : 10)) // devuelve los 10% primeros es decir 10 de 100.
	)																			// En caso que la cantidad de adyacentes sea menor a 10 devuelve un numero random entre 0 y la mitad de la cantidad de adyacentes
	return v[adyacentes[randomInt]]
}

// retorna una tupla con (solucion, costo)
function BusquedaLocal(solucion, matrizCompleta){ // O(n)
	let vecindarioPeor = false
	let solucionActual = [solucion, costo(solucion, matrizCompleta)]
	while(!vecindarioPeor){ // O(n)
		let mejorSolucionVecindario = solucionActual
		for (let i = 0; i < solucion.length; i++) { // 0(n)
			const nodoSiguiente = (i + 1) % solucion.length
			const costoNuevo = costoAlIntercambiar(i, nodoSiguiente, solucionActual, matrizCompleta)
			if(costoNuevo < mejorSolucionVecindario[1]){
				mejorSolucionVecindario = [swap(i, nodoSiguiente, solucionActual[0]), costoNuevo]
			}
		}
		if(mejorSolucionVecindario[1] >= solucionActual[1]){
			vecindarioPeor = true
		} else {
			solucionActual = mejorSolucionVecindario
		}
	}
	return solucionActual
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
function mod(n, m) { // usado debido a que el operador % en javascript no funciona con numeros negativos
	return ((n % m) + m) % m;
}

const grafo = [{visitado: false, adyacentes: [0, 1, 2, 3, 4], numero: 0}, {visitado: false, adyacentes: [0, 1, 2, 3, 4], numero: 1}, {visitado: false, numero: 2, adyacentes: [0, 1, 2, 3, 4]}, {visitado: false, numero: 3, adyacentes: [0, 1, 2, 3, 4]}, {visitado: false, adyacentes: [0, 1, 2, 3, 4], numero: 4}]
const matriz =  [ 
					[0, 6, 5, 4, 5], 
				  	[6, 0, 1, 2, 4], 
				  	[5, 1, 0, 3, 2], 
				  	[4, 2, 3, 0, 1],
					[5, 4, 2, 1, 0]
				]
const res = ViajanteDeComercio(grafo, matriz)
const resBusqueda = BusquedaLocal([...res], matriz)

console.log(res, resBusqueda)