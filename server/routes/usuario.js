const express = require('express');
const bcrypt = require('bcryptjs');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
//underscore para extender codigo javascript 'metodos' como pick
//que nos permite escoger las propiedades que pueden ser modificadas
const _ = require('underscore');

const Usuario = require('../models/usuario');
const app = express();

//USAMOS UN MIDDLEWARE
app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde);
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email img estado google role')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })

            }

            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    numeroRegistros: conteo,
                    usuarios
                })

            });



        });
})
app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        //encryptacion con hash
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        } else {
            res.json({
                persona: usuarioDB
            })
        }
    })
})
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {


    let id = req.params.id;
    // estas son las propiedades que si se pueden modificar
    let body = _.pick(req.body, 'nombre', 'email', 'img', 'role', 'estado');

    //runValidators: true //ejecuta las validaciones antes de actualizar
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        } else {

            res.json({
                usuario: usuarioDB
            })
        }

    })

})
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {



    let id = req.params.id;
    //let body = req.body;
    //console.log(body.estado);

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        } else {

            res.json({
                usuario: usuarioBorrado
            })
        }

    })

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     }

    //     if (!usuarioBorrado) {

    //         return res.status(400).json({
    //             ok: false,
    //             err: 'Usuario no encontrado'
    //         })
    //     }

    //     res.json({
    //         usuarioBorrado
    //     })

    // });


})

module.exports = app;