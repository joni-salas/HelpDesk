var express = require('express');
var router = express.Router();
const Registrar = require("../controllers/registrarController");
/* GET home page. */
router.get('/', (req, res,next)=> Registrar.principal(req, res,next));
router.post('/login', (req, res,next)=> Registrar.login(req, res,next));
router.post('/registrarCliente', (req, res,next)=> Registrar.registrar(req, res,next));
router.post('/buscasolicitud', (req, res,next)=> Registrar.buscarTicket(req, res,next));


module.exports = router;
