var express = require('express');
var router = express.Router();
const Cliente = require("../controllers/clienteControllers");

router.get('/', (req, res,next)=> Cliente.inicio(req, res,next));
router.post('/crearsolicitud', (req, res,next)=> Cliente.creaSolicitud(req, res,next));
router.post('/borrarsolicitud', (req, res,next)=> Cliente.borrarSolicitud(req, res,next));
router.post('/actualizarsolicitud', (req, res,next)=> Cliente.actualizarSolicitud(req, res,next));
router.post('/buscarticket', (req, res,next)=> Cliente.buscarTicket(req, res,next));
router.get('/cerrarsession', (req, res,next)=> Cliente.cerrarSession(req, res,next));
router.post('/cerrarcuenta', (req, res,next)=> Cliente.cerrarCuenta(req, res,next));
router.post('/cambiarcontra', (req, res,next)=> Cliente.cambiarContra(req, res,next));
router.post('/editarperfil', (req, res,next)=> Cliente.editarPerfil(req, res,next));
router.post('/vertrayectoria', (req, res,next)=> Cliente.verTrayectoria(req, res,next));

let ClienteAutenti = function(req, res, next) {
    if (req.session.cliente) return next();
    if (req.session.empleadoCalidad)
        res.redirect("../empleadoCalidad");
    if (req.session.empleadoGestion)
        res.redirect("../empleadoGestion");
    if (req.session.empleadoHelpdesk)
        res.redirect("../empleadoHelpdesk");
    if (req.session.empleadoComun)
        res.redirect("../empleado");
    res.redirect("../");
};
module.exports = router;
module.exports.ClienteAutenticado = ClienteAutenti;
