const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const schemaUsuario = new Schema({

        nombre: {

            type: String,
            required: [true, 'El nombre es necesario']
        },
        email: {
            type: String,
            required: [true, 'El correo es necesario']
        },
        password: {
            type: String,
            required: [true, 'la contraseña es obligatoria']
        },
        img: {
            type: String,
            required: false
        },
        role: {
            type: String,
            default: 'USER_ROLE'
        },
        estado: {
            type: Boolean,
            default: true
        },
        google: {
            type: Boolean,
            default: false
        }

    })
    //primer parametro es para el nombre del modelo y el segundo la estructura que va tener
module.exports = mongoose.model('Usuario', schemaUsuario);