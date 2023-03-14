// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
// libreria para msj de validation.
const { check } = require('express-validator');

//check funcionara como un middleware 
// middleware: algo que esta en el medio
// entre mi ruta y mi función.

//import controllers
const usuarioController = require("../controllers/usuarioController");


// Crear un usuario
// api/usuarios
router.post("/",
  //middleware(checkea los errores)
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Agrega un Email Valido').isEmail(),
    check('password', 'El password debe tener mínimo de 6 caracteres').isLength({ min: 6 }),
  ],
  usuarioController.crearUsuario
);

//Obtener el listado de Usuarios
router.get('/', usuarioController.obtenerUsuarios)

//Obtener UN usuario
router.get('/:id', usuarioController.obtenerUsuario)

//Actualizar UN usuario
router.put('/:id', usuarioController.modificarUsuario)

//Borrar UN usuario
router.delete('/:id', usuarioController.borrarUsuario)

module.exports = router;

