// import model
const Producto = require('../models/Producto');

// libreria para crear el token
const jwt = require('jsonwebtoken');

// methods
// Crear producto
exports.crearProducto = async (req, res) => {
  try {
    // LEER TOKEN 
    const token = req.header('x-auth-token');

    // REVISAR TOKEN (validamos que el token no venga vacío)
    if (!token) {
      return res.status(401).json({ msg: 'No hay Token, permiso no valido' })
    }

    //Validar  el token 
    const cifrado = jwt.verify(token, process.env.SECRETA);

    //nuevo producto
    const producto = new Producto({ ...req.body, creador: cifrado.usuario.id });
    producto.fecha = new Date();

    //guardar usuario
    await producto.save();

    //mensaje de éxito
    res.send("Producto Creado Correctamente");

  } catch (error) {
    console.log(error);
    res.status(400).send("Hubo un error");
  }
};

// Obtener lista de producto
// con el método populate('') podemos obtener una propiedad de nuestro producto
// en este caso 'creador' en la cual al tener el token, tendrá guardada
// todas las demás propiedades (información) dentro de ella del usuario creador.
// lo que hace el método populate() nos permite leer los datos, si no esta presente el populate()
// solo vamos a leer un id.
// const productos = await Producto.find().populate('creador');
exports.obtenerProductos = async (req, res) => {
  try {
    // en este caso con el populate() hacemos una búsqueda especifica, en la linea de abajo buscamos el 'name'
    const productos = await Producto.find().populate({ path: 'creador', select: 'name' });
    res.send(productos)
  } catch (error) {
    res.status(400).send("Hubo un error en la conexión a la base de datos")
  }
}

//Obtener un producto.
exports.obtenerProducto = async (req, res) => {
  try {
    const productos = await Producto.findById(req.params.id).select('nombre sucursal');
    res.send(productos)
  } catch (error) {
    res.status(400).send("Hubo un error en la conexión a la base de datos")
  }
}

// Borrar un producto
exports.borrarProducto = async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id)
    res.send("producto eliminado")
  } catch (error) {
    res.status(400).send("Hubo un error en la conexión a la base de datos")
  }
}

// Modificar un Producto
exports.modificarProducto = async (req, res) => {
  try {
    // Buscamos cual es el meme que queremos modificar. 
    const producto = await Producto.findById(req.params.id);
    // VALIDACIÓN(evitar actualizar nuestra base de dato con datos vacios)
    if (req.body.hasOwnProperty('nombre')) {
      producto.nombre = req.body.nombre;
    }
    if (req.body.hasOwnProperty('vencimiento')) {
      producto.vencimiento = req.body.vencimiento;
    }
    if (req.body.hasOwnProperty('sucursal')) {
      producto.sucursal = req.body.sucursal;
    }
    if (req.body.hasOwnProperty('cantidad')) {
      producto.cantidad = req.body.cantidad;
    }
    if (req.body.hasOwnProperty('nota')) {
      producto.nota = req.body.nota;
    }
    // guardar producto actualizado
    producto.save();

    //mensaje de éxito
    res.send("Producto Actualizado Correctamente");

  } catch (error) {
    console.log(error);
    res.status(400).send("Hubo un error")
  }
}