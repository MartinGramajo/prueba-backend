const Usuario = require("../models/Usuario");
//libreria pra hashear(ocultar) el password.
const bcryptjs = require('bcryptjs');
// libreria para crear el token
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');

// registrar usuario
exports.registrar = async (req, res) => {

  // revisamos los errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ msg: errores.array() });
  }


  const { email, password } = req.body;

  try {
    let usuarioEncontrado = await Usuario.findOne({ email });

    // msj al usuario de que el usuario esta uso.
    if (usuarioEncontrado) {
      return res.status(400).json({ msg: 'El email ya existe' });
    }

    //nuevo usuario
    // el express syntax{...} nos tira un error 
    // solución: agregar el engine{node + version}
    const bodyUsuario = { ...req.body, role: 'user' };
    // en la linea de arriba, nos aseguramos que el usuario al registrarse
    // siempre tenga el role de 'user', esto evita que tenga 
    // controles o permisos propios de un admin. 
    usuario = new Usuario(bodyUsuario);


    //hashear el password
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt)

    //guardar usuario
    await usuario.save();


    //mensaje de exito
    res.send("Usuario Registrado Correctamente");
  } catch (error) {
    console.log(error);
    res.status(400).send("Hubo un error");
  }
};

//Login.
exports.login = async (req, res) => {
  try {
    // revisamos los errores.
    // si mail y el password son correctos.
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ msg: errores.array() });
    }

    const { email, password } = req.body;
    //Revisar el usuario registrado
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: 'datos incorrectos. agregar un email valido' });
    }

    //Revisar el password
    // recuperamos el password hasheado.
    const passCorrect = await bcryptjs.compare(password, usuario.password);
    if (!passCorrect) {
      return res.status(400).json({ msg: 'Password incorrecto' });
    }

    //install libreria
    //npm install jsonwebtoken
    // Si todo es correcto Crear y firmar JWT
    // PARÁMETROS DE LA FUNCTION.

    // PARÁMETRO PAYLOAD
    // crea un object (payload) el cual contiene usuario
    // ese usuario contiene 2 o mas propiedades 
    // en este caso el id y el role. 
    const payload = {
      usuario: {
        id: usuario.id,
        role: usuario.role,
      },
    };
    // PARÁMETRO JWT.SIGN()
    // en este parámetro se combina el payload + nuestra palabra secreta definida en .env. 
    jwt.sign(
      payload,
      process.env.SECRETA,
      // PARÁMETRO DE LAS CONFIG 
      // dentro de estas llaves vamos a pasar 
      // todas las configuraciones que sean necesarias
      // en este caso tenemos en que tiempo va a expirar el token.
      {
        expiresIn: 3600, //1 hora
      },
      // 4 PARÁMETRO FUNCTION CALLBACK - DEFINICIÓN DE LO QUE PASARA CON EL TOKEN
      // validaciones : se creo correctamente el toke o bien ya sea que hubo un error. 
      // en el res.json (enviamos el token y el nombre del usuario)
      (error, token) => {
        if (error) throw error;
        res.json({ token, name: usuario.name, role: usuario.role });
      }
    );
  } catch (error) {
    res.status(400).send("Hubo un error en la conexión a la base de datos")
  }
}

// obtener usuario autenticado
exports.obtenerUsuarioAutenticado = async (req, res) => {
  // .select('-password) es un metodo de mongoose que nos permite 
  // eliminar u omitir datos que no queremos que se muestren en nuestro array de consulta. 
  // en este caso lo que hacemos es omitir el password y el register. 
  // const usuario = await Usuario.findById(req.usuario.id).select('-password -register');
  // o bien traer los datos que queremos utilizar
  // en el presente ejemplo traemos name, email, role

  // LEER TOKEN 
  // header: otra parte de la request donde podemos enviar datos. 
  const token = req.header('x-auth-token');

  // REVISAR TOKEN (validamos que el token no venga vacío)
  if (!token) {
    return res.status(401).json({ msg: 'No hay Token, permiso no valido' })
  }

  // Validar Token(por si el codigo puede fallar lo envolvemos en el bloque try/catch)
  // el permiso seria validar al usuario para poder ver su información. 

  try {
    const cifrado = jwt.verify(token, process.env.SECRETA);
    // para encontrar al usuario encontrado.
    const usuario = await Usuario.findById(cifrado.usuario.id).select('name email role');
    res.json({ usuario });
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
}

