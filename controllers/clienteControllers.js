const Cliente =require("../models").cliente;
const Area =require("../models").area;
const Solicitud =require("../models").solicitud;
const Historial =require("../models").historial;
const session = require("express-session");
const bcrypt = require('bcryptjs');
var moment = require('moment'); // require
let clienteSession = async (req, res,next) => await Cliente.findOne({
    where: {mail: req.session.email}
});


//--------------------------------------------------------------INICIO--------------------------------------------//
exports.inicio = async function (req, res, next) {
    let cli = await clienteSession(req, res,next);
    let areas= await Area.findAll();
    
    let solicitudesResueltas = await Historial.findAll({
        where : { estado: "Resuelto"},
        include : [  
            {
              model : Solicitud, 
              where: {dni_cliente : cli.dni},     
              attributes: ['id_solicitud','ticket','prioridad','fecha_solicitud','detalle','tipo','dni_cliente'],
              required: true,
            }
        ]});
    let solicitudesPendientes= await Historial.findAll({ 
        where : { estado: "Pendiente"},
        include : [  
            {
              model : Solicitud, 
              where: {dni_cliente : cli.dni},     
              attributes: ['id_solicitud','ticket','prioridad','fecha_solicitud','detalle','tipo','dni_cliente'],
              required: true,
            }
        ]});

    let ArrSolicitudesPendientes=[];
    solicitudesPendientes.forEach(val => {
            
        ArrSolicitudesPendientes.push(val.solicitud)
    });

    //console.log(JSON.stringify(historialSolicitud, null, 2));
    
    let solicitudResueltaCount = await Historial.count({
        where : { estado: "Resuelto"},
        include : [  
            {
              model : Solicitud, 
              where: {dni_cliente : cli.dni},     
              attributes: ['id_solicitud','ticket','prioridad','fecha_solicitud','detalle','tipo','dni_cliente'],
              required: true,
            }
        ]});
    let solicitudes = await Solicitud.findAll({
        where:{ dni_cliente: cli.dni},
    });

    res.render("../views/cliente",{
        cliente: cli,
        solicitudes: solicitudes,
        areas: areas,
        TrayeGlobal: req.query.TrayeGlobal,
        passwordError: req.query.passwordError,
        passwordActualError: req.query.passwordActualError,
        solicitudesResueltas: solicitudesResueltas,
        ArrSolicitudesPendientes: ArrSolicitudesPendientes,
        solicitudResueltaCount: solicitudResueltaCount,
        buscasoli: req.query.buscasoli,
        
    });
    
};
//-------------------------------------------------------------GET TICKET RANDOM------------------------------------------//
let getTicket = async () => {
    let buscaTicket;
    let ticket;
    do {
        ticket =Math.floor(Math.random() * (10000000 - 1000000)) + 1000000;
        buscaTicket = await Solicitud.findOne({where: {ticket: ticket}});

    } while (buscaTicket);
    return ticket;
};
//-------------------------------------------------------------CREAR SOLICITUD------------------------------------------//
exports.creaSolicitud = async function (req, res, next) {
    let dni=req.session.dni;
    let ticketRand = await getTicket();

    let momfecha = moment(Date.now());
    let fecha = momfecha.format('YYYY-MM-DD HH:mm:ss');

    const solicitud = await Solicitud.create({
        ticket: ticketRand,
        fecha_solicitud: fecha,
        detalle: req.body.detalle,
        tipo: req.body.tipo,
        dni_cliente: dni,
    })
    
    let buscaSolicitud = await Solicitud.findOne({
        where: {ticket : ticketRand}
    }) 
    console.log(buscaSolicitud);
    const historial = await Historial.create({
        fecha_ingreso: fecha,
        estado: "Pendiente",
        detalle_razon: "",
        detalle_solucion: "",
        id_area: 1,
        id_solicitud: buscaSolicitud.id_solicitud,
    }).then((result) => {
        req.flash('success_msg', 'Solicitud Enviada.');
        res.redirect("../../cliente"); 
    });
};
//-------------------------------------------------------------BORRAR------------------------------------------//
exports.borrarSolicitud = async function (req, res) {
    try{
      const solicitud=await Solicitud.destroy({
        where: { id_solicitud: req.body.id },
      })
      req.flash('success_msg', 'Solicitud borrada.');
      res.redirect("../../cliente");  
    }catch(e){
      //console.log(e);
      req.flash('error_msg', 'LA solicitud esta siendo gestionada.');
      res.redirect("../../cliente");
    };
  }
//-------------------------------------------------------------ACTUALIZAR------------------------------------------//
  exports.actualizarSolicitud = async function (req, res, next) {

    let momfecha = moment(Date.now());
    let fecha = momfecha.format('YYYY-MM-DD HH:mm:ss');

    const solicitudBuscar = await Solicitud.findOne({where: { id_solicitud: req.body.id }});
    const solicitudModificada = await Solicitud.update(
        {
            ticket: solicitudBuscar.ticket,
            fecha_solicitud: fecha,
            detalle: req.body.detalle,
            tipo: req.body.tipo,
            dni_cliente: solicitudBuscar.dni_cliente,
        },
        { where: { id_solicitud: req.body.id } })
    req.flash('success_msg', 'Solicitud actualizada.');
    res.redirect("../../cliente");
};
//-------------------------------------------------------------Buscar ticket------------------------------------------//
exports.buscarTicket = async function (req, res,next) {
    let solicitud=await Solicitud.findOne({
      where: { ticket: req.body.ticket ,
               dni_cliente: req.session.dni},
    });
    
    if(solicitud != null){
        let ObjSolicitud=[];
        ObjSolicitud.push(solicitud.dataValues);
        //console.log("solicitud: "+ObjSolicitud);

        let fechamom = moment(ObjSolicitud.fecha_egreso, "DD-MM-YYYY HH:mm:ss");
        let fechaFormat = fechamom.format('YYYY-MM-DD HH:mm:ss');
        //console.log(fechaFormat);
        ObjSolicitud.fecha_solicitud = fechaFormat;

        //console.log(ObjSolicitud);
        let buscasoli = JSON.stringify(ObjSolicitud);
       //console.log(buscasoli);
        res.redirect("../../cliente?buscasoli[]="+buscasoli);
        //console.log(buscasoli.dataValues);
    }else{
        req.flash('error_msg', 'La solicitud pertenece a otro usuario.');
        res.redirect("../../cliente");
    }
};
//-------------------------------------------------------------CERRAR SESSION------------------------------------------//
exports.cerrarSession = async function (req, res, next) {
    req.session.destroy((err) => {
        res.redirect("../../");  
    })
};
//-------------------------------------------------------------CERRAR CUENTA------------------------------------------//
exports.cerrarCuenta = async function (req, res, next) {
    let cliente = await Cliente.update({
            estado:"Inactivo",
    },
        {where: { dni: req.session.dni}} 
    );
    
    let confirmacion ="La cuenta se cerro de forma permanente, y debera volver a registrarse con otro Email si quiere acceder";
    req.session.destroy((err) => {
        res.redirect(`../../?confirmacion=`+ confirmacion);  
    });
};
//-------------------------------------------------------------CAMBIAR CONTRASEÑA------------------------------------------//
exports.cambiarContra = async function (req, res, next) {
    let buscaCliente = await Cliente.findOne({
         
        where: {dni: req.session.dni} 
    }); 
    buscaCliente =buscaCliente.dataValues;
    //console.log(buscaCliente);

    let validPassword = await bcrypt.compare(req.body.contraActual, buscaCliente.contraseña);

    if(validPassword){
        if(req.body.contraNueva == req.body.contraRepeNueva){
            var salt = await bcrypt.genSalt(10);
            let password = await bcrypt.hash(req.body.contraNueva, salt);

            let cliente = await Cliente.update({
                contraseña: password,
            },
            {where: { dni: req.session.dni}

            }).then((result) => {
                req.flash('success_msg', 'Contraseña actualizada.');
                res.redirect("../../cliente"); 
            }).catch((err) => {
                console.log(err);
            });
        }else{
            let passwordError= "Las contraseñas no coinciden";
            res.redirect(`../../cliente?passwordError=`+ passwordError);
        }
    }else{
        let passwordActualError= "La contraseña es incorrecta";
        res.redirect(`../../cliente?passwordActualError=`+ passwordActualError);
    }
    
};
//----------------------------------------EDITAR PERFIL---------------------------------------------------//

exports.editarPerfil = async function (req, res, next) {

    const clienteBuscar = await Cliente.findOne({where: { dni: req.session.dni }});
    const cliente = await Cliente.update(
        {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            mail: clienteBuscar.mail, //modificar
            celular: req.body.celular,
            fecha: req.body.fecha,
        },
        { where: { dni: clienteBuscar.dataValues.dni } })
    req.flash('success_msg', 'Datos actualizados.');
    res.redirect("../../cliente");
};
//----------------------------------------VER TRAYECTORIA---------------------------------------------------//

exports.verTrayectoria = async function (req, res, next) {
    let cli = await clienteSession(req, res,next);
    let trayectoria= await Historial.findAll({ 
        where : { id_solicitud: req.body.id},
        include : [  
            {
              model : Solicitud,     
              attributes: ['id_solicitud','ticket','prioridad','fecha_solicitud','detalle','tipo','dni_cliente'],
              required: true,
            },
            {
                model : Area,      
                attributes: ['id_area','nombre_area','estado'],
                required: true,
              }
        ],
        order: [['fecha_egreso', 'DESC']],
    });
    //console.log(JSON.stringify(trayectoria, null, 2));

    let ArrTrayeGlobal=[];
    trayectoria.forEach(val => {
        ArrTrayeGlobal.push(val.dataValues);
        //console.log(ArrTrayeGlobal)

    });

    ArrTrayeGlobal.map(function(dato){
        if(dato.fecha_egreso != null){
            let fechamom = moment(dato.fecha_egreso, "DD-MM-YYYY HH:mm:ss");
            let fechaFormat = fechamom.format('YYYY-MM-DD HH:mm:ss');
            //console.log(fechaFormat);
            dato.fecha_egreso = fechaFormat;
        }else{
            dato.fecha_egreso = " ";
        }
    })
    //console.log(ArrTrayeGlobal);
    let TrayeGlobal = JSON.stringify(ArrTrayeGlobal);
    
    //console.log(TrayeGlobal);

    res.redirect("../../cliente?TrayeGlobal="+TrayeGlobal);

}