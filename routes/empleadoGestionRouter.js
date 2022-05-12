var express = require('express');
var router = express.Router();
const Empleado = require("../controllers/empleadoGestionControllers");

/* GET users listing. */
router.get('/', (req, res,next)=> Empleado.inicio(req, res,next));
router.post('/registrarEmpleado', (req, res,next)=> Empleado.crearEmpleado(req, res,next));
router.post('/crearArea', (req, res,next)=> Empleado.crearArea(req, res,next));
router.post('/desactivar', (req, res,next)=> Empleado.desactivarEmpleado(req, res,next));
router.post('/activar', (req, res,next)=> Empleado.activarEmpleado(req, res,next));
router.post('/transferir', (req, res,next)=> Empleado.transferirEmpleado(req, res,next));
router.post('/desactivarArea', (req, res,next)=> Empleado.desactivarArea(req, res,next));
router.post('/activarArea', (req, res,next)=> Empleado.activarArea(req, res,next));
router.post('/cambiarcontra', (req, res,next)=> Empleado.cambiarContra(req, res,next));
router.post('/editarEmpleado', (req, res,next)=> Empleado.editarEmpleado(req, res,next));
router.post('/editarArea', (req, res,next)=> Empleado.editarArea(req, res,next));
router.get('/clientes', (req, res,next)=> Empleado.clientesPendientes(req, res,next));
router.post('/desactivarCliente', (req, res,next)=> Empleado.desactivarCliente(req, res,next));
router.post('/activarCliente', (req, res,next)=> Empleado.activarCliente(req, res,next));
router.get('/cerrarsession', (req, res,next)=> Empleado.cerrarSession(req, res,next));

let EmpleadoGestionAutenti = function(req, res, next) {
    if (req.session.empleadoGestion) return next();
    if (req.session.empleadoCalidad)
        res.redirect("../empleadoCalidad");
    if (req.session.empleadoHelpdesk)
        res.redirect("../empleadoHelpdesk");
    if (req.session.empleadoComun)
        res.redirect("../empleado");
    if (req.session.cliente)
        res.redirect("../cliente");
    // si el usuario no esta autenticado entonces lo redirigimos a donde tengo el login
    res.redirect("../");
};

module.exports = router;
module.exports.EmpleadoGestionAutenticado = EmpleadoGestionAutenti;