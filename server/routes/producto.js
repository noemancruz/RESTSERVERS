const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const Producto = require('../models/producto');

app.get('/producto', verificaToken, (req, res) => {

    Producto.find({})
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            Producto.countDocuments((err, total) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    total,
                    productos
                })
            })
        });

});
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Producto.findOne({ _id: id })
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productoDB
            })
        })


});
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    // expresion regular que nos permite hacer busquedas mas flexibles
    //es decir nos encuentra todos los resultados aunque la busqueda no
    //coincida al 100% con el producto buscado
    //LA 'i' ES PARA QUE NO SEA SENSIBLE A MAYUSCULAS O MINUSCULAS
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .exec((err, productoEncontrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoEncontrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'no se encontraron resultados'
                    }
                })
            }
            res.json({
                ok: true,
                producto: productoEncontrado
            })
        })

})

app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })

});
app.put('/producto/:id', verificaToken, (req, res) => {

    let body = req.body;
    let id = req.params.id;
    Producto.findOneAndUpdate({ _id: id }, body, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            productoDB
        })

    })


});
app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findOneAndUpdate({ _id: id }, { disponible: false }, { new: true, runValidators: true, context: 'query' }, (err, productoEliminado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoEliminado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el producto no existe'
                }
            })
        }
        res.json({
            ok: true,
            productoEliminado
        })

    })


});



module.exports = app;