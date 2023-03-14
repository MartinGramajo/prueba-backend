//Obtener datos del usuario “autenticado”
//Obtener los datos que guardamos en el tokens. 
// En nuestro caso seria el id + role.

const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
  // Leer token
  const token = req.header('x-auth-token');
  // headers es otra parte donde podemos guardar datos.
  // Revisar Token
  if (!token) {
    return res.status(401).json({ msg: 'No hay Token, permiso no valido' })
  }
  // Validar Token
  // CIFRADO = PAYLOAD(propiedad que guardamos)
  try {
    const cifrado = jwt.verify(token, process.env.SECRETA);
    req.usuario = cifrado.usuario;
    next()
  } catch (error) {
    res.status(401).json({ msg: 'Token no valido' })
  }
}
