// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
// libreria para msj de validation.
const { check } = require('express-validator');

//check funcionara como un middleware 
// middleware: algo que esta en el medio
// entre mi ruta y mi función.

//import controllers
const authController = require("../controllers/authController");
const auth = require('../middleware/auth');


// Registro Usuarios
router.post("/register",
  //middleware(checkea los errores)
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Agrega un Email Valido').isEmail(),
    check('password', 'El password debe tener mínimo de 6 caracteres').isLength({ min: 6 }),
  ],
  authController.registrar
);

//Login
router.post(
  '/login',
  [
    check('email', 'Agrega un Email Valido').isEmail(),
    check('password', 'El password debe tener mínimo de 6 caracteres').isLength({ min: 6 }),
  ],
  authController.login)

//Obtener usuario autenticado
router.get('/', auth, authController.obtenerUsuarioAutenticado);

module.exports = router;
