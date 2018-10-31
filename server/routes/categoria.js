const express = require('express');
const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

const Categoria = require('../models/categoria');
const Usuario = require('../models/usuario');


app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            Categoria.countDocuments({}, (err, total) => {
                res.json({
                    total,
                    categoria: categorias
                })
            });
        })

})
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'la categoria no existe'
                }
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })



})
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    //let id = body.id_usuario;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id

    })

    Usuario.findById(req.usuario._id, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: 'el usuario no existe'
            })
        } else {
            //SI SACAS LA FUNCION categoria.save DEL ELSE SE VUELVE OTRA RESPUESTA Y LANZARIA  
            //ERROR PORQUE UNA VEZ QUE LA RESPUESTA SE MANDA NO PUEDE VOLVERSE A MANDAR
            // EN CAMBIO SI ESTA DENTRO DEL ELSE SE CONSIDERA COMO PARTE DE LAS POSIBLES RESPUESTAS
            // QUE PUEDE TOMAR EL SERVICIO DE get('/categoria')
            categoria.save((err, categoriaDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                } else {
                    res.json({
                        ok: true,
                        categoria: categoriaDB
                    })
                }
            })
        }
    })

})
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, 'descripcion', 'usuario');

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoriaDB
        })


    })

})
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    Categoria.findOneAndDelete({ _id: id }, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            })
        }
        res.json({
            ok: true,
            categoriaBorrada
        })

    })

})

module.exports = app;