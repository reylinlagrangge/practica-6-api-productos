const express = require('express')
const app = express()

app.use(express.json())

const productos = [
    {
        id: 1,
        nombre: 'Teclado inalambrico',
        descripcion: 'Teclado 101 teclas idioma ingles',
        precio: 1500.00
    },
    {
        id: 2,
        nombre: 'Mouse inalambrico',
        descripcion: 'Mouse optico inalambrico.',
        precio: 600.00
    },
    {
        id: 3,
        nombre: 'Monitor 23.5 pulgadas full hd',
        descripcion: 'Monitor Full HD panel IPS',
        precio: 6500.00
    }
]

// GET - Listar todos los productos
app.get('/productos', (req, res) => {
    res.json(productos)
})

// GET - Obtener un producto por id
app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    res.json(producto)
})


// ============================================================
// PRÁCTICA 6: Completa los siguientes métodos de la API
// ============================================================

// POST /productos - Crear nuevo producto
app.post('/productos', (req, res) => {
    // Se leen los datos que vienen en el cuerpo de la petición
    const { nombre, descripcion, precio } = req.body

    // Validación: los tres campos son obligatorios (400 si falta alguno)
    if (!nombre || !descripcion || precio === undefined || precio === null || precio === '') {
        return res.status(400).json({
            mensaje: 'Los campos nombre, descripcion y precio son obligatorios'
        })
    }

    // Se convierte el precio a número
    const precioNumero = parseFloat(precio)

    // Reto opcional: el precio debe ser un número mayor que cero
    if (isNaN(precioNumero) || precioNumero <= 0) {
        return res.status(400).json({
            mensaje: 'El precio debe ser un número mayor que cero'
        })
    }

    // Se genera un id nuevo que no se repita: el id más alto existente + 1
    const nuevoId = productos.length > 0
        ? Math.max(...productos.map(p => p.id)) + 1
        : 1

    const nuevoProducto = {
        id: nuevoId,
        nombre,
        descripcion,
        precio: precioNumero
    }

    // Se agrega al arreglo y se responde con 201 (Created)
    productos.push(nuevoProducto)
    res.status(201).json(nuevoProducto)
})


// PUT /productos/:id - Actualizar producto
app.put('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)

    // Se busca la posición del producto en el arreglo
    const indice = productos.findIndex(p => p.id === id)

    // Si no existe, se responde 404
    if (indice === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    const { nombre, descripcion, precio } = req.body

    // Validación: los tres campos son obligatorios (400 si falta alguno)
    if (!nombre || !descripcion || precio === undefined || precio === null || precio === '') {
        return res.status(400).json({
            mensaje: 'Los campos nombre, descripcion y precio son obligatorios'
        })
    }

    // Reto opcional: el precio debe ser un número mayor que cero
    const precioNumero = parseFloat(precio)
    if (isNaN(precioNumero) || precioNumero <= 0) {
        return res.status(400).json({
            mensaje: 'El precio debe ser un número mayor que cero'
        })
    }

    // Se reemplazan los datos conservando el mismo id
    productos[indice] = {
        id: id,
        nombre,
        descripcion,
        precio: precioNumero
    }

    res.status(200).json(productos[indice])
})


// DELETE /productos/:id - Eliminar producto
app.delete('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)

    // Se busca la posición del producto en el arreglo
    const indice = productos.findIndex(p => p.id === id)

    // Si no existe, se responde 404
    if (indice === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    // splice elimina el producto del arreglo y devuelve un arreglo con el eliminado
    const productoEliminado = productos.splice(indice, 1)[0]

    res.status(200).json({
        mensaje: 'Producto eliminado',
        producto: productoEliminado
    })
})


app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})