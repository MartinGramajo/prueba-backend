const Usuario = require("../models/Usuario");
//libreria pra hashear(ocultar) el password.
const bcryptjs = require('bcryptjs')

// validar el middleware {check}.
// permite comunicarle el error al usuario.
const { validationResult } = require('express-validator');

// req: variable que va a contener los datos. 
// por ej cuando hacemos un post va a contener los datos.
// res: respuesta de la bd con lo
// exports.crearUsuario = (req, res) => {
//   console.log(req.body);
// };

exports.crearUsuario = async (req, res) => {

  // revisamos los errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ msg: errores.array() });
  }


  const { email, password } = req.body;

  try {
    // Revisando q el email sea único.
    // .findOne(verifica que el parámetro enviado sea único)
    // en este caso que el email sea único.
    let usuarioEncontrado = await Usuario.findOne({ email });

    // msj al usuario de que el usuario esta uso.
    if (usuarioEncontrado) {
      return res.status(400).json({ msg: 'El email ya existe' });
    }

    //nuevo usuario
    usuario = new Usuario(req.body);


    //hashear el password
    // npm install bcryptjs
    // libreria que nos permite scriptar el password
    // datos sensible ni el admin puede observar esto.
    // getSalt(10) es la veces que se repite el algorithms
    // para ocultar el password.
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt)

    //guardar usuario
    // .save() function propia de mongo.
    await usuario.save();


    //mensaje de exito
    res.send("Usuario Creado Correctamente");
  } catch (error) {
    console.log(error);
    res.status(400).send("Hubo un error");
  }
};

//Obtener la lista de usuarios creados.
exports.obtenerUsuarios = async (req, res) => {
  // console.log('funcion para obtener el listado de usuarios');
  // res.send("funcion para obtener el listado de usuarios");\
  try {
    const usuarios = await Usuario.find();
    res.send(usuarios)
  } catch (error) {
    res.status(400).send("Hubo un error en la conexión a la base de datos")
  }
}

//Obtener un usuario.
exports.obtenerUsuario = async (req, res) => {
  // console.log('USUARIO ENCONTRADO', req.params);
  // res.send("USUARIO ENCONTRAD");
  try {
    const usuarios = await Usuario.findById(req.params.id).select('name email');
    res.send(usuarios)
  } catch (error) {
    res.status(400).send("Hubo un error en la conexión a la base de datos")
  }
}

//Borrar un usuario.
exports.borrarUsuario = async (req, res) => {
  // console.log('USUARIO Borrado', req.params);
  // res.send("USUARIO Borrado");
  try {
    await Usuario.findByIdAndDelete(req.params.id)
    res.send("usuario eliminado")
  } catch (error) {
    res.status(400).send("Hubo un error en la conexión a la base de datos")
  }
}

// Modificar Un usuario
exports.modificarUsuario = async (req, res) => {
  // console.log('USUARIO Modificado', req.params);
  // res.send("USUARIO Modificado");
  try {
    const usuario = await Usuario.findById(req.params.id);
    // condición: si en body no viene una propiedad "name" vamos a devolverlo como un error. 
    if (!req.body.name) {
      return res.status(404).send("Dato de nombre incompleto")
    }
    // Porque para actualizar un usuario si o si queremos que venga un valor nuevo en name. 
    usuario.name = req.body.name;
    await usuario.save();
    res.send(usuario)
  } catch (error) {
    res.status(400).send("Hubo un error en la conexión a la base de datos")
  }
}