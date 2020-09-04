const mongoose = require('mongoose');
const { Schema } = mongoose;

const Pedido = new Schema({
    lat: Number,
    lng: Number,
    name: String,
    created: { type: Date, default: Date.now },
    estado: String
});

module.exports = mongoose.model('Pedido', Pedido);
