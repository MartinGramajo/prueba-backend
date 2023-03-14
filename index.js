// Importación de módulos de versiones anteriores. 
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');


// cors
var cors = require('cors')

//consulta a la ruta 
const usuarioRoutes = require('./routes/usuariosRoute')
const productoRoutes = require('./routes/productosRoute')
const authRoutes = require('./routes/authRoute')


// Creando el servidor 
const app = express();

//Permitir acceso, cors
app.use(cors())


// Conectar a mongodb
mongoose.connect(process.env.MONGO_URL)

// Habilitar express.json (también se puede usar body parser)
// config:habilita los datos para poder tomarlo y/o crearlos
app.use(express.urlencoded({ extended: true }));
// config: habilita para recibir el formato de la consulta
// ya sea en JSON o urlencoded:
app.use(express.json({ extended: true }));



// RUTAS 
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/productos', productoRoutes)
app.use('/api/auth', authRoutes)



// puerto y arranque del servidor 
app.listen(process.env.PORT || 4000, () => {
  console.log('Servidor funcionando')
})
