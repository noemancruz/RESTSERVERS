require('../config/config');
const express = require('express');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

const app = express();



app.post('/login', (req, res) => {

        let body = req.body;

        Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    message: '(usuario) o contrasena incorrectos'
                })
            }

            if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
                return res.status(400).json({
                    ok: false,
                    message: 'usuario o (contrasena) incorrectos'
                })
            }
            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: process.env.EXPIRACION })

            res.json({
                ok: true,
                usuario: usuarioDB,
                token
            })
        })
    })
    // configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async(req, res) => {

    let idToken = req.body.idtoken;

    let googleUser = await verify(idToken)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (usuarioDB) {
            //si el usuario existe en la base de datos pero fue creado por medio del postman NO por google 
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticacion normal'
                    }
                })
            } else {
                //si el usuario existe en la base de datos se renueva el token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRACION })

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            //si el usuario no existe en nuestra base de datos
            let usuario = new Usuario();

            usuario.nombre = googleUser.name;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRACION })


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            })

        }

    })
})
module.exports = app;