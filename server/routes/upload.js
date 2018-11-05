const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            err: {
                message: 'No files were uploaded.'
            }
        })
    }

    let tipo = req.params.tipo;
    let id = req.params.id;
    let tiposValidos = ['usuarios', 'productos'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'los tipos permitidos son: ' + tiposValidos.join(',')
            }
        })
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let extension = nombreCortado[nombreCortado.length - 1];
    //INDEXOF devuelve el idice del valor a buscar dentro de su arreglo
    //si no encuentra devuelve -1
    if (extensionesValidas.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,
            message: 'las extensiones permitidas son ' + extensionesValidas.join(' , ')
        })
    }
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })

        if (tipo == 'usuarios') {
            imagenUsuario(res, id, nombreArchivo);

        } else {

            imagenProducto(res, id, nombreArchivo);
        }

    });
});

function imagenUsuario(res, id, nombreArchivo) {

    Usuario.findOne({ _id: id }, (err, usuarioDB) => {

        if (err) {
            //Borrar imagen
            borrarImagen(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            //borrar imagen
            borrarImagen(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el usuario no existe'
                }
            })
        }

        borrarImagen(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                usuarioGuardado
            })

        });

    })

}

function imagenProducto(res, id, nombreArchivo) {
    Producto.findOne({ _id: id }, (err, productoDB) => {

        if (err) {
            //Borrar imagen
            borrarImagen(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            //borrar imagen
            borrarImagen(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el producto no existe'
                }
            })
        }

        borrarImagen(productoDB.img, 'productos');
        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                productoGuardado
            })

        });

    })
}

function borrarImagen(nombreArchivo, tipo) {
    let imagenUrl = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(imagenUrl)) {
        fs.unlinkSync(imagenUrl);
    }
}
module.exports = app;