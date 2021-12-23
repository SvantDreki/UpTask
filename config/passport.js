const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modelo que se va a autenticar
const Usuarios = require('../models/Usuarios');

//local strategy - Login con credenciales propias (usuario y contraseña)
passport.use(
    new LocalStrategy(
        //por defecto passport espera usuario y contraseña pero se pueden renombrar
        {
            usernameField : 'email',
            passwordField : 'password'
        },
        async function(email, password, done) {
            
            try {
                const usuario = await Usuarios.findOne({
                    where : {
                        email,
                        activo : 1
                    }
                });

                //El usuario existe, password incorrecto
                if(!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message : 'Password Incorrecta'
                    })
                }

                //El usuario existe y password correcta
                return done(null, usuario);

            } catch (error) {
                //si el usuario no existe
                //done toma 3 parametros el error, usuario, y el mensaje
                return done(null, false, {
                    message : 'Esa cuenta no existe'
                })
            }
        }

    )
    
    
);

//Serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

//Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;