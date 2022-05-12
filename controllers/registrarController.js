const session = require("express-session");
const Cliente =require("../models").cliente;
const Area =require("../models").area;
const Empleado =require("../models").empleado;
const bcrypt = require('bcryptjs');
const Solicitud =require("../models").solicitud;
const { Op } = require("sequelize");

exports.principal = async function (req, res, next) {

    let dniClienteParse;
    if(req.query.dniCliente != null ){
        dniClienteParse = JSON.parse(req.query.dniCliente)
        //console.log(psa)
    }
    let mailClienteParse;
    if(req.query.mailCliente != null ){
        mailClienteParse = JSON.parse(req.query.mailCliente)
        //console.log(psa)
    }

        res.render("../views/index",{
            dniCliente: dniClienteParse,
            mailCliente: mailClienteParse,
            confirmacion: req.query.confirmacion,
        });
};

exports.sessionIniciada = async function (req, res, next) {
    
};
//---------------------------------------------LOGIN------------------------------------------//

exports.login = async function (req, res, next) {
    req.session.email =req.body.email;
    req.session.contra =req.body.contra;
    req.session.save();
    const buscaCliente = await Cliente.findOne({
 
        where: {mail: req.body.email,
            estado:"Aceptado" }});
    const buscaEmpleadoGestion = await Empleado.findOne({
        where: {mail: req.body.email,
                estado: 1,
                id_area: 3}
    });
    const buscaEmpleadoHelpdesk = await Empleado.findOne({
        where: {mail: req.body.email,
                estado: 1,
                id_area: 1}
    });
    const buscaEmpleadoCalidad = await Empleado.findOne({
 
        where: {mail: req.body.email,
            estado: 1,
            id_area: 2}
    });  
    const buscaEmpleadoComun = await Empleado.findOne({
 
        where: {mail: req.body.email,
            estado: 1,
            id_area:{ [Op.gt]: 3},
        }
    }); 
    //console.log(buscaEmpleadoComun);
    
      
    if(buscaCliente){
        req.session.dni =buscaCliente.dni;
        req.session.cliente = true;
        req.session.save();
        const validPassword = await bcrypt.compare(req.body.contra, buscaCliente.contraseña);
        

        if(validPassword){
            res.redirect("../cliente");
        }else{
            req.flash('error_msg', 'Contraseña invalida o correo invalido.');
            res.redirect("../../");
        }

        
    }else if(buscaEmpleadoGestion){
        req.session.dni = buscaEmpleadoGestion.dni;
        req.session.empleadoGestion = true;
        req.session.save();
        const validPassword = await bcrypt.compare(req.body.contra, buscaEmpleadoGestion.contraseña);

        let buscaArea = await Area.findOne({
            where: {
                id_area: buscaEmpleadoGestion.id_area,
                estado: 1}
        });

        if(buscaArea){
            if(validPassword){
                res.redirect("../empleadoGestion");
            }else{
                req.flash('error_msg', 'Contraseña invalida o correo invalido.');
                res.redirect("../../");
            }
        }else{
            req.flash('error_msg', 'El area se encuentra en mantenimiento.');
            res.redirect("../../");
        }
        
    }else if(buscaEmpleadoHelpdesk){
        req.session.dni = buscaEmpleadoHelpdesk.dni;
        req.session.empleadoHelpdesk = true;
        req.session.save();
        const validPassword = await bcrypt.compare(req.body.contra, buscaEmpleadoHelpdesk.contraseña);

        let buscaArea = await Area.findOne({
            where: {
                id_area: buscaEmpleadoHelpdesk.id_area,
                estado: 1}
        });
        if(buscaArea){
            if(validPassword){
                res.redirect("../empleadoHelpdesk");
            }else{
                req.flash('error_msg', 'Contraseña invalida o correo invalido.');
                res.redirect("../../");
            }
        }else{
            req.flash('error_msg', 'El area se encuentra en mantenimiento.');
            res.redirect("../../");
        }
        
    }else if(buscaEmpleadoCalidad){
        req.session.dni = buscaEmpleadoCalidad.dni;
        req.session.empleadoCalidad = true;
        req.session.save();
        const validPassword = await bcrypt.compare(req.body.contra, buscaEmpleadoCalidad.contraseña);

        let buscaArea = await Area.findOne({
            where: {
                id_area: buscaEmpleadoCalidad.id_area,
                estado: 1}
        });
        if(buscaArea){
            if(validPassword){
                res.redirect("../empleadoCalidad");
            }else{
                req.flash('error_msg', 'Contraseña invalida o correo invalido.');
                res.redirect("../../");
            }
        }else{
            req.flash('error_msg', 'El area se encuentra en mantenimiento.');
            res.redirect("../../");
        }
    }else if(buscaEmpleadoComun){
        req.session.dni = buscaEmpleadoComun.dni;
        req.session.empleadoComun = true;
        req.session.save();
        const validPassword = await bcrypt.compare(req.body.contra, buscaEmpleadoComun.contraseña);

        let buscaArea = await Area.findOne({
            where: {
                id_area: buscaEmpleadoComun.id_area,
                estado: 1}
        });
        if(buscaArea){
            if(validPassword){
                res.redirect("../empleado");
            }else{
                req.flash('error_msg', 'Contraseña invalida o correo invalido.');
                res.redirect("../../");
            }
        }else{
            req.flash('error_msg', 'El area se encuentra en mantenimiento.');
            res.redirect("../../");
        }
    }else{
        req.flash('error_msg', 'Contraseña invalida o correo invalido.');
        res.redirect("../../");
    }
};
//-------------------------------------REGISTRAR CLIENTE-----------------------------------//

exports.registrar = async function (req, res, next) {
    const buscaCliente = await Cliente.findOne({where: {[Op.or]: [{ mail: req.body.email }, { dni: req.body.dni }] }});
    const buscaEmpleado = await Empleado.findOne({where: {[Op.or]: [{ mail: req.body.email }, { dni: req.body.dni }] }});

    if(!buscaCliente && !buscaEmpleado){
        var salt = await bcrypt.genSalt(10);
        let password = await bcrypt.hash(req.body.contra, salt);
        const cliente = await Cliente.create({
            dni: req.body.dni,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            mail: req.body.email,
            celular: req.body.celular,
            contraseña: password,
            fecha: req.body.fecha,
            estado: "Pendiente",
        }).then((result) => {
            req.flash('success_msg', 'Registrado exitosamente.');
            res.redirect("../../"); 
        }).catch((err) => {
            if(err){
                let dniexiste = "Dni existente";
                let nombre = req.body.nombre;
                let apellido = req.body.apellido;
                let email = req.body.email;
                let celular = req.body.celular;
                let area = req.body.area;
                let fecha = req.body.fecha;
                let registro1 = { "fecha": fecha, "celular": celular, "email": email, "apellido": apellido, "nombre": nombre, "area": area, "dniexiste": dniexiste, }  
                let registro = JSON.stringify(registro1);
                res.redirect(`../../?dniCliente=`+ registro);
            }
        });
        
    }else if(buscaCliente !=null){
        let dniexiste = "Dni existente";
        let nombre = req.body.nombre;
        let apellido = req.body.apellido;
        let email = req.body.email;
        let celular = req.body.celular;
        let area = req.body.area;
        let fecha = req.body.fecha;
        let registro1 = { "fecha": fecha, "celular": celular, "email": email, "apellido": apellido, "nombre": nombre, "area": area, "dniexiste": dniexiste, }  
        let registro = JSON.stringify(registro1);
        res.redirect(`../../?dniCliente=`+ registro);
    }else{
        let emailExiste = "Email se encuentra en uso.";
        let dni = req.body.dni;
        let nombre = req.body.nombre;
        let apellido = req.body.apellido;
        let celular = req.body.celular;
        let fecha = req.body.fecha;
        let registro1 = { "fecha": fecha, "celular": celular, "apellido": apellido, "nombre": nombre, "emailExiste": emailExiste,"dni": dni }  
        let registro = JSON.stringify(registro1);
        res.redirect(`../../?mailCliente=`+ registro);
    }
};

//-------------------------------------------------------------Buscar ticket------------------------------------------//
exports.buscarTicket = async function (req, res,next) {
    let solicitud = await Solicitud.findOne({
      where: { ticket: req.body.ticketIndex },
    });
    console.log(req.body.ticketIndex)
    console.log(solicitud);
    if(solicitud){
        res.render("../views/index", {
            ticket: solicitud.dataValues,
        });

    }else{
        req.flash('error_msg', 'El ticket buscado no existe.');
        res.redirect(`../../`);
    }
};