const Cliente =require("../models").cliente;
const Empleado = require("../models").empleado;
const Solicitud =require("../models").solicitud;
const Area =require("../models").area;
const session = require("express-session");
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");

let empleadoSession = async (req, res,next) => await Empleado.findOne({
    where: {mail: req.session.email}
});


//---------------------------------------------------------INICIO-------------------------------------------------//
exports.inicio = async function (req, res, next) {
    let emp =  await empleadoSession(req, res,next);
    let empleados= await Empleado.findAll({
        where: {mail: {[Op.ne]: emp.mail}}
    });
    let areas= await Area.findAll();
    let clientes = await Cliente.findAll();
    let clientesPendientes = await Cliente.count({
        where:{estado: "Pendiente"}
    })
    let dniEmpleadoGestionParse;
    if(req.query.dniEmpleadoGestion != null ){
        dniEmpleadoGestionParse = JSON.parse(req.query.dniEmpleadoGestion)
        //console.log(psa)
    }
    let mailEmpleadoGestionParse;
    if(req.query.mailEmpleadoGestion != null ){
        mailEmpleadoGestionParse = JSON.parse(req.query.mailEmpleadoGestion)
        //console.log(psa)
    }

    res.render("../views/empleadoGestion",{
        email: req.session.email,
        empleadoGestion: emp,
        areas: areas,
        dniEmpleadoGestion: dniEmpleadoGestionParse,
        mailEmpleadoGestion: mailEmpleadoGestionParse,
        empleados: empleados,
        passwordErrorGestion: req.query.passwordErrorGestion,
        passwordActualErrorGestion: req.query.passwordActualErrorGestion,
        clientesPendientes: clientesPendientes,
        clientes: clientes,
        activar: req.query.activar,
    });

    
};
//----------------------------------------------------CREAR EMPLEADO-------------------------------------------------//
exports.crearEmpleado = async function (req, res, next) {
    
    const buscaEmpleado = await Empleado.findOne({where: {mail: req.body.email}});
    const buscaCliente = await Cliente.findOne({where: {mail: req.body.email}});
    
    if(!buscaEmpleado && !buscaCliente){
        var salt = await bcrypt.genSalt(10);
        let password = await bcrypt.hash(req.body.contra, salt);
        const empleado = await Empleado.create({
            dni: req.body.dni,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            mail: req.body.email,
            telefono: req.body.telefono,
            contraseña: password,
            rol: "Empleado",
            id_area: req.body.area,
            estado: true,
            fecha: req.body.fecha,
            
        }).then((result) => {
            req.flash('success_msg', 'Registrado exitosamente.');
            res.redirect("../../empleadoGestion"); 
        }).catch((err) => {
            if(err){
                let dniexiste = "Dni existente";
                let nombre = req.body.nombre;
                let apellido = req.body.apellido;
                let email = req.body.email;
                let telefono = req.body.telefono;
                let fecha = req.body.fecha;
                let registro1 = { "fecha": fecha, "telefono": telefono, "email": email, "apellido": apellido, "nombre": nombre, "dniexiste": dniexiste, }  
                let registro = JSON.stringify(registro1);
                res.redirect(`../../empleadoGestion?dniEmpleadoGestion=`+ registro);
                console.log(registro);
            }
        });
        
    }else{
        let emailExiste = "Email se encuentra en uso.";
        let dni = req.body.dni;
        let nombre = req.body.nombre;
        let apellido = req.body.apellido;
        let telefono = req.body.telefono;
        let fecha = req.body.fecha;
        let registro1 = { "fecha": fecha, "telefono": telefono, "apellido": apellido, "nombre": nombre, "emailExiste": emailExiste,"dni": dni }  
        let registro = JSON.stringify(registro1);

        res.redirect(`../../empleadoGestion?mailEmpleadoGestion=`+ registro);
    }
};
//------------------------------------------CREAR AREA---------------------------------------------------//
exports.crearArea = async function (req, res, next) {

    const buscaArea = await Area.findOne({where: {nombre_area: req.body.nombreArea}});
    //console.log(buscaArea);
    if(!buscaArea){
        const area = await Area.create({
            nombre_area: req.body.nombreArea,
            estado: true,
        }).then((result) => {
            req.flash('success_msg', 'Area Creada.');
            res.redirect("../../empleadoGestion"); 
        }).catch((err) => {
            if(err){
                req.flash('error_msg', 'El nombre esta en uso.');
                res.redirect("../../empleadoGestion"); 
            }
        });
    }else{
        req.flash('error_msg', 'El nombre esta en uso.');
        res.redirect("../../empleadoGestion"); 
    }
};
//------------------------------------------desactivar empleado---------------------------------------------------//
exports.desactivarEmpleado = async function (req, res, next) {
    const empleado = await Empleado.update(
        {
            estado: false,
        },
        { where: { dni: req.body.id } })
    res.redirect("../../empleadoGestion");
}
//------------------------------------------activar empleado---------------------------------------------------//
exports.activarEmpleado = async function (req, res, next) {
    const empleado = await Empleado.update(
        {
            estado: true,
        },
        { where: { dni: req.body.id } })
    res.redirect("../../empleadoGestion");
}
//------------------------------------------transferir empleado---------------------------------------------------//
exports.transferirEmpleado = async function (req, res, next) {
    const empleado = await Empleado.update(
        {
            id_area: req.body.area,
        },
        { where: { dni: req.body.id } })
    res.redirect("../../empleadoGestion");
}
//------------------------------------------Desactivar area---------------------------------------------------//
exports.desactivarArea = async function (req, res, next) {

    const area=await Area.update(
        {
            estado: false,
        },
        { where: { id_area: req.body.id }})
    res.redirect("../../empleadoGestion");  
}
//------------------------------------------Activar area---------------------------------------------------//
exports.activarArea = async function (req, res, next) {

    const area=await Area.update(
        {
            estado: true,
        },
        { where: { id_area: req.body.id }})
    res.redirect("../../empleadoGestion"); 
}
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
                res.redirect("../../empleadoGestion"); 
            }).catch((err) => {
                console.log(err);
            });
        }else{
            let passwordErrorGestion= "Las contraseñas no coinciden";
            res.redirect(`../../empleadoGestion?passwordErrorGestion=`+ passwordErrorGestion);
        }
    }else{
        let passwordActualErrorGestion= "La contraseña es incorrecta";
        res.redirect(`../../empleadoGestion?passwordActualErrorGestion=`+ passwordActualErrorGestion);
    }
};
//-------------------------------------------editar empleado-----------------------------------------------//

exports.editarEmpleado = async function (req, res, next) {

    const buscaEmailEmp = await Empleado.findOne({where: {mail: req.body.email, dni:{[Op.ne]: req.body.id} }});
    const buscaEmailCli = await Cliente.findOne({where: {mail: req.body.email}});

    if(!buscaEmailEmp && !buscaEmailCli){

        let empleado = await Empleado.update({
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            mail: req.body.email,
            telefono: req.body.telefono,
        },
        {where: { dni: req.body.id}

        }).then((result) => {
            res.redirect("../../empleadoGestion"); 
        }).catch((err) => {
            console.log(err);
        });
    }else{
        req.flash('error_msg', 'Email se encuentra en uso.');
        res.redirect("../../empleadoGestion");
    }
};
//-------------------------------------------Editar Area-----------------------------------------------//
exports.editarArea = async function (req, res, next) {

    const area=await Area.update(
        {
            nombre_area: req.body.nombreArea,
        },
        { where: { id_area: req.body.idArea }})
    res.redirect("../../empleadoGestion"); 
}
//-------------------------------------------Desabilitar cliente-----------------------------------------------//
exports.desactivarCliente = async function (req, res, next) {
    const area=await Cliente.update(
        {
            estado: "Pendiente",
        },
        { where: { dni: req.body.id }})
    let activar=true;
    res.redirect("../../empleadoGestion?activar="+activar);
}
//-------------------------------------------habilitar cliente-----------------------------------------------//
exports.activarCliente = async function (req, res, next) {
    const area=await Cliente.update(
        {
            estado: "Aceptado",
        },
        { where: { dni: req.body.id }})
    let activar=true;
    res.redirect("../../empleadoGestion?activar="+activar);
}

//-------------------------------------------------------------CERRAR SESSION------------------------------------------//
exports.cerrarSession = async function (req, res, next) {
    req.session.destroy((err) => {
        res.redirect("../../");  
    })
};