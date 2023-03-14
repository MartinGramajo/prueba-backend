// Rutas para Productos
const express = require('express');
const router = express.Router();

//import controllers
const productoController = require("../controllers/productoController");

// métodos 
router.post('/', productoController.crearProducto)

//Obtener el listado de Productos
router.get('/', productoController.obtenerProductos)

//Obtener un Producto en particular
router.get('/:id', productoController.obtenerProducto)

//Borrar un Producto 
router.delete('/:id', productoController.borrarProducto)

// Modificar un Producto
router.put('/:id', productoController.modificarProducto)

module.exports = router;