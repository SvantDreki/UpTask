const express = require('express');
const routes = express.Router();

//Importar express-validator
const {body} = require('express-validator');

//importa controlador
const proyectoControllers = require('../controllers/proyectoControllers');
const tareasControllers = require('../controllers/tareasControllers');
const usuariosControllers = require('../controllers/usuariosControllers');
const authControllers = require('../controllers/authControllers');

module.exports = function() {
    //ruta del home 
    routes.get('/',
        authControllers.usuarioAutenticado,
        proyectoControllers.proyectoHome
    );
    routes.get('/nuevo-proyecto',
        authControllers.usuarioAutenticado,
        proyectoControllers.formularioProyecto
    );
    routes.post('/nuevo-proyecto',
            authControllers.usuarioAutenticado,
            body('nombre').not().isEmpty().trim().escape(),
            proyectoControllers.nuevoProyecto
    );

    //Listar Proyecto
    routes.get('/proyectos/:url',
        authControllers.usuarioAutenticado,
        proyectoControllers.proyectoPorUrl
    );

    //Actualizar Proyecto
    routes.get('/proyectos/editar/:id',
        authControllers.usuarioAutenticado,
        proyectoControllers.formularioEditar
    );
    routes.post('/nuevo-proyecto/:id',
        authControllers.usuarioAutenticado,
            body('nombre').not().isEmpty().trim().escape(),
            proyectoControllers.actualizarProyecto
    );

    //Eliminar Proyecto
    routes.delete('/proyectos/:url',
        authControllers.usuarioAutenticado,
        proyectoControllers.eliminarProyecto
    );

    //Tareas
    routes.post('/proyectos/:url',
        authControllers.usuarioAutenticado,
        tareasControllers.agregarTarea
    );

    //Actualizar Tareas
    routes.patch('/tareas/:id',
        authControllers.usuarioAutenticado,
        tareasControllers.cambiarEstadoTarea
    );

    //Eliminar Tarea
    routes.delete('/tareas/:id',
        authControllers.usuarioAutenticado,
        tareasControllers.eliminarTarea
    );

    //Cuentas de usuarios
    routes.get('/crear-cuenta', usuariosControllers.fromCrearCuenta);
    routes.post('/crear-cuenta', usuariosControllers.crearCuenta);
    //routes.get('/confirmar/:correo', usuariosControllers.confirmarCuenta);

    //Iniciar Sesión
    routes.get('/iniciar-sesion', usuariosControllers.fromIniciarSesion);
    routes.post('/iniciar-sesion', authControllers.autenticarUsuario);

    //Cerrar Sesión
    routes.get('/cerrar-sesion', authControllers.cerrarSesion);

    //Restablecer contraseña
    routes.get('/reestablecer', usuariosControllers.formReestablecerPass);
    routes.post('/reestablecer', authControllers.enviarToken);
    routes.get('/reestablecer/:token', authControllers.validarToken);
    routes.post('/reestablecer/:token', authControllers.actulizarPassword);

    return routes;
}