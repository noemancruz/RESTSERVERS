const mongoose = require('mongoose');
//las validaciones del campo 'nombre' del Schema no se ejecutan
// en el update porque el registro ya cuenta 
//con el campo nombre y solo se esta actualizando
//las validaciones del role no pertenecen al mongoo-validator
//conclusion las validaciones normales como las de mongoo-validator funcionan juntas
const uniqueValidator = require('mongoose-unique-validator');

let rolesValido = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

const Schema = mongoose.Schema;

const schemaUsuario = new Schema({

    nombre: {

        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        index: true,
        unique: true,
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
        default: 'USER_ROLE',
        enum: rolesValido
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

//se modifica el metodo que se llama cuando usamos json 
//toJSON es el metodo que se llama cuando usamos json como respuesta
schemaUsuario.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

schemaUsuario.plugin(uniqueValidator, {
    message: '{PATH}, debe de ser unico'
});
//primer parametro es para el nombre del modelo y el segundo la estructura que va tener
module.exports = mongoose.model('Usuario', schemaUsuario);