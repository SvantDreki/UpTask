const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.fromCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Nueva Cuenta'
    });
}

exports.fromIniciarSesion = (req, res) => {
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesión',
        error
    });
}

exports.crearCuenta = async (req, res) => {
    //Leer los datos
    const {email, password} = req.body;
    const activo = 1;
    
    try {
        //Crear el usuario
        await Usuarios.create({
            email,
            password,
            activo       
        });

        //crear una url de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear el objeto de usuario
        const usuario = {
            email
        }

        //enviar email
        /*await enviarEmail.enviar({
            usuario,
            subject : 'Confirmar tu cuenta uptask',
            confirmarUrl,
            archivo : 'confirmar-cuenta'
        });
        */
        //redirigir al usuario
        //req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            nombrePagina: 'Crear Nueva Cuenta',
            mensajes : req.flash(),
            email,
            password
        });
    }

}

exports.formReestablecerPass = (req, res) => {
    res.render('reestablecer', {
        nombrePagina : 'Reestablecer tu Contraseña'
    });
}

//cambia el estado de una cuenta
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where : {
            email : req.params.correo
        }
    });

    if(!usuario) {
        req.flash('error', 'No Valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}