let libros = JSON.parse(localStorage.getItem('libros')) || []

let editando = false;
let indiceEditar = null;
let ordenAscendente = true;

const agregarLibro = () => {
    const titulo = document.getElementById('titulo').value.trim()
    const autor = document.getElementById('autor').value.trim()
    const anio = document.getElementById('anio').value
    const genero = document.getElementById('genero').value.trim()
    const leido = document.getElementById('leido').checked

    //Validacion de campos completos
    if (titulo !== '' && autor !== '' && anio !== '' && genero !== '') {

        if (editando) {
            libros[indiceEditar] = {
                titulo,
                autor,
                anio,
                genero,
                leido
            }
            editando = false
            indiceEditar = null
            document.querySelector('button[type="submit"]').innerText = 'Agregar libro'
        } else {
            //Validacion de libro existente
            const yaExiste = libros.some(libro =>
                libro.titulo.toLowerCase() === titulo.toLowerCase() &&
                libro.autor.toLowerCase() === autor.toLowerCase()
            )

            if (yaExiste) {
                alert("Este libro ya esta registrado.")
            }

            //Validacion de año (1900 - 2025)
            const anioActual = 2025 //esta hardcodeado 
            if (anio <= 1900 || anio > anioActual) {
                alert("El año debe estar entre 1900 - " + anioActual)
                return
            }

            //guardamos en el array local los libros que vamos creando
            libros.push({
                titulo,
                autor,
                anio,
                genero,
                leido
            })
        }

        //guardamos en la localStorage los libros que vamos crando 
        localStorage.setItem('libros', JSON.stringify(libros))

        renderizarLibros()
        mostrarResumen()

        document.getElementById('titulo').value = ''
        document.getElementById('autor').value = ''
        document.getElementById('anio').value = ''
        document.getElementById('genero').value = ''
        document.getElementById('leido').checked = false
    }
}

//Filtro de libros por titulo
const filtrarLibros = () => {
    const filtroTitulo = document.getElementById('busqueda').value.toLowerCase()

    const librosFiltrados = libros.filter(libro => libro.titulo.toLowerCase().includes(filtroTitulo))
    renderizarLibros(librosFiltrados)
}

//Filtro de libros por genero
const filtroGenero = () => {
    const genero = document.getElementById('filtroGenero').value

    if (genero === '') {
        renderizarLibros()
    } else {
        const librosFiltrados = libros.filter(libro => libro.genero === genero)
        renderizarLibros(librosFiltrados)
    }
}

//Funcion renderizar
const renderizarLibros = (lista = libros) => {
    const tabla = document.getElementById('tablaLibro').querySelector('tbody')

    tabla.innerHTML = ''

    lista.forEach((libro, index) => {
        const fila = document.createElement('tr')

        fila.innerHTML = `
        <td>${index + 1}</td>
        <td>${libro.titulo}</td>
        <td>${libro.autor}</td>
        <td>${libro.anio}</td>
        <td>${libro.genero}</td>
        <td>${libro.leido ? '✅' : '❌'}</td>
        <td>
            <button onclick="editarLibro(${index})">Editar</button>
            <button onclick="eliminarLibro(${index})">Eliminar</button>
        </td>
        `

        tabla.appendChild(fila)
    })
}

//Funcion resumen
const mostrarResumen = () => {
    const resumen = document.getElementById('resumenLibros')

    if (libros.length === 0) {
        resumen.innerText = 'No hay libros cargados'
        return;
    }

    //Total de libros
    const total = libros.length

    //Promedio
    const sumaAnios = libros.reduce((acum, libro) => acum + parseInt(libro.anio), 0)
    const promedio = Math.round(sumaAnios / total)

    //Filtro libros posteriores a 2010
    const posteriorA2010 = libros.filter(libro => libro.anio < 2010).length

    //Filtro libros mas reciente y mas antiguo
    const libroAntiguo = libros.reduce((nuevo, libro) => (libro.anio < nuevo.anio ? libro : nuevo), libros[0])
    const libroNuevo = libros.reduce((nuevo, libro) => (libro.anio > nuevo.anio ? libro : nuevo), libros[0])

    //Filtro mostrar cuantos estan leidos/no leidos
    const leidos = libros.filter(libro => libro.leido).length
    const noLeidos = libros.length - leidos

    resumen.innerHTML = `
    <p>Total de libros: ${total}</p>
    <p>Promedio del año de publicacion: ${promedio}</p>
    <p>Posterior a 2010: ${posteriorA2010}</p>
    <p>Libro mas antiguo: ${libroAntiguo.titulo}, Autor: ${libroAntiguo.autor} | Año: ${libroAntiguo.anio} - Genero: ${libroAntiguo.genero}</p>
    <p>Libro mas reciente: ${libroNuevo.titulo}, Autor: ${libroNuevo.autor} | Año: ${libroNuevo.anio} - Genero: ${libroNuevo.genero}</p>
    <p>Libros leídos: ${leidos}</p>
    <p>Libros no leídos: ${noLeidos}</p>
    `
}

//Funcion editar libro
const editarLibro = (index) => {
    const libro = libros[index]
    document.getElementById('titulo').value = libro.titulo
    document.getElementById('autor').value = libro.autor
    document.getElementById('anio').value = libro.anio
    document.getElementById('genero').value = libro.genero
    document.getElementById('leido').checked = libro.leido
    document.querySelector('button[type="submit"]').innerText = 'Agregar libro'
    editando = true
    indiceEditar = index
}

const ordenarLibros = () => {
    libros.sort((a, b) => ordenAscendente ? a.anio - b.anio : b.anio - a.anio)
    ordenAscendente = !ordenAscendente
    renderizarLibros()
}

//Funcion Eliminar libro
const eliminarLibro = (index) => {
    libros.splice(index, 1)
    localStorage.setItem('libros', JSON.stringify(libros))
    renderizarLibros()
    mostrarResumen()
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarLibros()
    mostrarResumen()
})
