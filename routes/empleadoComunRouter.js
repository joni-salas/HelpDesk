var express = require('express');
var router = express.Router();
const Empleado = require("../controllers/empleadoComunControllers");

router.get('/', (req, res,next)=> Empleado.inicio(req, res,next));
router.post('/cambiarcontra', (req, res,next)=> Empleado.cambiarContra(req, res,next));
router.post('/resolverSolicitud', (req, res,next)=> Empleado.resolverSolicitud(req, res,next));
router.post('/transferirSolicitud', (req, res,next)=> Empleado.transferirSolicitud(req, res,next));
router.post('/trayectoriaNoResuelta', (req, res,next)=> Empleado.trayectoriaNoResuelta(req, res,next));
router.get('/cerrarsession', (req, res,next)=> Empleado.cerrarSession(req, res,next));

let EmpleadoComunAutenti = function(req, res, next) {
    if (req.session.empleadoComun) return next();
    if (req.session.empleadoCalidad)
        res.redirect("../empleadoCalidad");
    if (req.session.empleadoGestion)
        res.redirect("../empleadoGestion");
    if (req.session.empleadoHelpdesk)
        res.redirect("../empleadoHelpdesk");
    if (req.session.cliente)
        res.redirect("../cliente");
    // si el usuario no esta autenticado entonces lo redirigimos a donde tengo el login
    res.redirect("../");
};

module.exports = router;
module.exports.EmpleadoComunAutenticado = EmpleadoComunAutenti;