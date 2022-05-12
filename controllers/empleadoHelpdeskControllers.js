const Cliente =require("../models").cliente;
const Empleado = require("../models").empleado;
const Historial = require("../models").historial;
const Solicitud =require("../models").solicitud;
const Area =require("../models").area;
const session = require("express-session");
const bcrypt = require('bcryptjs');
var moment = require('moment'); // require
const { Op } = require("sequelize");

let empleadoSession = async (req, res,next) => await Empleado.findOne({
    where: {mail: req.session.email}
});


//---------------------------------------------------------INICIO-------------------------------------------------//
exports.inicio = async function (req, res, next) {
    let emp =  await empleadoSession(req, res,next);
    let areas= await Area.findAll({where: {[Op.and]:[{id_area:{[Op.ne]: 1}},{id_area:{[Op.ne]: 3}}]}},)
    let clientes = await Cliente.findAll();
    let solicitudesPendientes = await Solicitud.count({
        where:{prioridad: null}
    });
    let solicitudesPendientesTabla = await Solicitud.findAll({
        where:{prioridad: null}
    });
    let solicitudesResueltas = await Historial.findAll({
        where: { id_area: emp.id_area }
    });

    let historialSolicitud = await Historial.findAll({
        where : { id_area: emp.id_area, [Op.and]: [{ estado:{[Op.ne]: "Transferido"}}, { estado:{[Op.ne]: "Resuelto"} }]},
        include : [  
            {
              model : Solicitud,

              where: {prioridad: {[Op.ne]: null}},     
              attributes: ['id_solicitud','ticket','prioridad','fecha_solicitud','detalle','tipo','dni_cliente'],
              required: true,
            }
        ],
        order: [['fecha_egreso', 'DESC']],
        });
    //console.log(JSON.stringify(historialSolicitud, null, 2));
    let ArrSolicitudes=[];
    historialSolicitud.forEach(val => {
        
        ArrSolicitudes.push(val.solicitud)
    });
    //console.log(ArrSolicitudes);

    res.render("../views/empleadoHelpdesk",{
        empleadoHelpdesk: emp,
        areas: areas,
        clientes: clientes,
        passwordErrorHelpdesk: req.query.passwordErrorHelpdesk,
        passwordActualErrorHelpdesk: req.query.passwordActualErrorHelpdesk,
        solicitudesPendientes: solicitudesPendientes,
        solicitudesResueltas: solicitudesResueltas,
        ArrSolicitudes: ArrSolicitudes,
        historialSolicitud: historialSolicitud,
        solicitudesPendientesTabla: solicitudesPendientesTabla,
        activarModalSP: req.query.activarModalSP,
        TrayeSolicitudHP: req.query.TrayeSolicitudHP,
    });  
};

//----------------------------------------------ASIGNAR PRIORIDAD---------------------------------------//

exports.asignarPrioridad = async function (req, res, next) {

    const solicitud = await Solicitud.update(
        {
            prioridad: req.body.prioridad,
        },
        { where: { id_solicitud: req.body.id } })
    let activarModalSP= true;  
    res.redirect(`../../empleadoHelpdesk?activarModalSP=`+activarModalSP);
};
//----------------------------------------------Resolver Solicitud---------------------------------------//

exports.resolverSolicitud = async function (req, res, next) {
    let emp =  await empleadoSession(req, res,next);
    let momfecha = moment(Date.now());
    let fecha = momfecha.format('YYYY-MM-DD HH:mm:ss');
    let fechaHistorial = moment(req.body.fechaHistorial, "DD-MM-YYYY HH:mm:ss");
    let fechaComparar = fechaHistorial.format('YYYY-MM-DD HH:mm:ss');

    let test = await Historial.findAll({
        where: {id_solicitud : req.body.id}
    });
    test.forEach(val=>{
        if(val.estado=="Pendiente"){
            let fechamom = moment(val.fecha_ingreso, "DD-MM-YYYY HH:mm:ss");
            let fechaFormat = fechamom.format('YYYY-MM-DD HH:mm:ss');
            console.log(fechaFormat);
            fechaComparar=fechaFormat;
        }
    })
    const solicitudUpdate = await Historial.update(
        {
            estado: "Resuelto",
            detalle_solucion: req.body.detalleSolucion,
            dni_empleado: emp.dni,
            fecha_egreso: fecha,
        },
        { where: { id_solicitud: req.body.id, fecha_ingreso: fechaComparar} 
    }).then((result) => {
        req.flash('success_msg', 'Solicitud Resuelta.');  
        res.redirect(`../../empleadoHelpdesk`);
    }).catch((err) => {
        console.log(err);
    });

};

//----------------------------------------------Transferir Solicitud---------------------------------------//

exports.transferirSolicitud = async function (req, res, next) {
    let emp =  await empleadoSession(req, res,next);
    let momfecha = moment(Date.now());
    let fechaHoy = momfecha.format('YYYY-MM-DD HH:mm:ss');
    let fechaHistorial = moment(req.body.fechaHistorial, "DD-MM-YYYY HH:mm:ss");
    let fechaComparar = fechaHistorial.format('YYYY-MM-DD HH:mm:ss');

    console.log(fechaComparar);

    let test = await Historial.findAll({
        where: {id_solicitud : req.body.id}
    });
    test.forEach(val=>{
        if(val.estado=="Pendiente"){
            let fechamom = moment(val.fecha_ingreso, "DD-MM-YYYY HH:mm:ss");
            let fechaFormat = fechamom.format('YYYY-MM-DD HH:mm:ss');
            console.log(fechaFormat);
            fechaComparar=fechaFormat;
        }
    })

    const historialUpdate = await Historial.update(
        {   
            estado: "Transferido",
            detalle_razon: req.body.detalleRazon,
            dni_empleado: emp.dni,
            fecha_egreso: fechaHoy,
        },
        { where: { id_solicitud: req.body.id, fecha_ingreso: fechaComparar} 
    })
    
    let historial = await Historial.create(
        {   
            fecha_ingreso: fechaHoy,
            estado: "Pendiente",
            id_area: req.body.areaTransferir,
            id_solicitud: req.body.id,
        },
        { where: { id_solicitud: req.body.id, fecha_ingreso: fechaComparar} 
    }).then((result) => {
        req.flash('success_msg', 'Solicitud Transferida.');  
        res.redirect(`../../empleadoHelpdesk`);
    }).catch((err) => {
        console.log(err);
    });

};

//------------------------------------------Cambiar Contraseña---------------------------------------------------//
exports.cambiarContra = async function (req, res, next) {
    let buscaEmpleado = await Empleado.findOne({
         
        where: {dni: req.session.dni} 
    }); 
    buscaEmpleado =buscaEmpleado.dataValues;
    //console.log(buscaCliente);

    let validPassword = await bcrypt.compare(req.body.contraActual, buscaEmpleado.contraseña);

    if(validPassword){
        if(req.body.contraNueva == req.body.contraRepeNueva){
            var salt = await bcrypt.genSalt(10);
            let password = await bcrypt.hash(req.body.contraNueva, salt);

            let empleado = await Empleado.update({
                contraseña: password,
            },
            {where: { dni: req.session.dni}

            }).then((result) => {
                req.flash('success_msg', 'Contraseña actualizada.');
                res.redirect("../../empleadoHelpdesk"); 
            }).catch((err) => {
                console.log(err);
            });
        }else{
            let passwordErrorHelpdesk= "Las contraseñas no coinciden";
            res.redirect(`../../empleadoHelpdesk?passwordErrorHelpdesk=`+ passwordErrorHelpdesk);
        }
    }else{
        let passwordActualErrorHelpdesk= "La contraseña es incorrecta";
        res.redirect(`../../empleadoHelpdesk?passwordActualErrorHelpdesk=`+ passwordActualErrorHelpdesk);
    }
}; 

//--------------------------------------------TRAYECTORIA NO RESUELTAS---------------------------------------//
exports.trayectoriaNoResuelta = async function (req, res, next) {

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

    let ArrTrayeSolicitud=[];
    trayectoria.forEach(val => {
        ArrTrayeSolicitud.push(val.dataValues);
        //console.log(ArrTrayeSolicitud)

    });

    ArrTrayeSolicitud.map(function(dato){
        if(dato.fecha_egreso != null){
            let fechamom = moment(dato.fecha_egreso, "DD-MM-YYYY HH:mm:ss");
            let fechaFormat = fechamom.format('YYYY-MM-DD HH:mm:ss');
            //console.log(fechaFormat);
            dato.fecha_egreso = fechaFormat;
        }else{
            dato.fecha_egreso = " ";
        }
    })
    //console.log(ArrTrayeSolicitud);
    let TrayeSolicitudHP = JSON.stringify(ArrTrayeSolicitud);
    
    //console.log(TrayeSolicitud);

    res.redirect("../../empleadoHelpdesk?TrayeSolicitudHP="+TrayeSolicitudHP);

}

//-------------------------------------------------------------CERRAR SESSION------------------------------------------//
exports.cerrarSession = async function (req, res, next) {
    req.session.destroy((err) => {
        res.redirect("../../");  
    })
};