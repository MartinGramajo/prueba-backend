const mongoose = require("mongoose");
const ProductoSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  fecha: {
    type: Date,
    required: true,
    trim: true,
  },
  vencimiento: {
    type: Date,
    required: true,
    trim: true,
  },
  sucursal: {
    type: String,
    required: true,
    trim: true,
  },
  cantidad: {
    type: Number,
    required: true,
    trim: true,
  },
  nota: {
    type: String,
    required: true,
    trim: true,
  },
  register: {
    type: Date,
    default: Date.now(),
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  }
});

module.exports = mongoose.model("Producto", ProductoSchema);