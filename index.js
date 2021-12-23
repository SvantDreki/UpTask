const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//helpers con algunas funciones
const helpers = require('./helpers');

//Crear la conexion a la db
const db = require('./config/db');

//Importar modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

//sync: si la tabla no esta creada la crea automaticamente deacuerdo al modelo
db.sync()
    .then(() => console.log('Conectado a la DB'))
    .catch(error => console.log(error))

//Crear una aplicacion de express
const app = express();

//Donde estan los archivos estaticos
app.use(express.static('public'));

//Habilitar pug
app.set('view engine', 'pug');

//Habilitar bodyParser para leer los datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

//Añadir las carpetas de las vistas
app.set('views', path.join(__dirname, './views'));

//Agregar flash messages
app.use(flash());

app.use(cookieParser());

//Habilitar session
app.use(session({
    secret : 'supersecreto',
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

//Pasar el vardump a la aplicacion
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});


//ruta para el home
app.use('/', routes())

//Puerto en el que corre express
app.listen(3000);

require('./handlers/email');