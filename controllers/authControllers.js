const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

//passport.authenticate recive 2 parametros
//la Strategy que que utiliza y la configuracion que se le va a dar
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/iniciar-sesion',
    failureFlash : true,
    badRequestMessage : 'Ambos campos son Obligatorios'
});

//Revisa que si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
    //si el usuario esta autenticado, adelante
    if(req.isAuthenticated()) {
        return next();
    }

    //sino esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

//Cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
}

//Genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {
    //verificar si el usuario existe
    const { email } = req.body;
    const usuario = await Usuarios.findOne({ where : { email } });

    //Si el usuario no existe
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.render('reestablecer', {
            nombrePagina : 'Reestablecer Contraseña',
            mensajes : req.flash()
        });
    }

    //Usuario existe
    const token = crypto.randomBytes(20).toString('hex');
    //3600000 = 1 hora
    const expiracion = Date.now() + 3600000;

    usuario.token = token;
    usuario.expiracion = expiracion;

    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    //enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject : 'Password Reset',
        resetUrl,
        archivo : 'reestablecer-password'
    });

    req.flash('correcto', 'Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where : {
            token : req.params.token
        }
    });

    //Sino encuentra al usuario
    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    //Formulario para resetear el password
    res.render('resetPassword', {
        nombrePagina : 'Reestablecer Contraseña'
    });
}

//Cambia el pass por uno nuevo
exports.actulizarPassword = async (req, res) => {
    //Verifica el token pero también la fecha de expiracón
    const usuario = await Usuarios.findOne({
        where : {
            token : req.params.token,
            expiracion : {
                [Op.gte] : Date.now()
            }
        }
    });

    //Verifica si el usuario existe
    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    //hashear el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    //Guardar el nuevo password
    await usuario.save();
    req.flash('correcto', 'Password actualizada correctamente');
    res.redirect('/iniciar-sesion');

}