const Recibo = require('../../models/Recibo');
const User = require('../../models/Usuario');
const Producto = require('../../models/Producto');
var debug = require('debug')('proyectoWeb:user_controller');

//Metodo para postman de ver un solo recibo generado al comprar de compra
module.exports.getOne = (req, res, next) => {
    debug("Search recibo", req.params);
    Recibo.findOne({
        productoId: req.body.productoId,
        usuarioId: req.body.usuarioId
    })
        .then((foundRecibo) => {
            if (foundRecibo) {
                console.log("found");
                return res.status(200).json(foundRecibo);
            }
            else
                return res.status(400).json(error);
        })
        .catch((err) => {
            next(err);
        })
}

//Metodo frecuentemente ocupado que genera recibos al ordenarlos en la pagina web
module.exports.makeRecibo = async (req, res, next) => {
    debug("Recibo", { body: req.body });

    var productos = [];
    await Recibo.findOne({
        _id: req.body._id
    })
        .then((foundRecibo) => {
            if (foundRecibo) {
                debug("Recibo ya existente");
                throw new Error(`Recibo ya existente ${req.body.usuarioNombre} ${req.body.productoNombre}`);
            }
            else {
                var d = new Date();
                let newRecibo = new Recibo({
                    productoId: req.body.productoId,
                    productoNombre: req.body.nombre,
                    usuarioId: req.body.usuarioId,
                    usuarioNombre: req.body.username,
                    fechaCompra: Date()
                });
                Producto.findOne({ _id: newRecibo.productoId })
                    .then((foundProduct) => {
                        if(foundProduct.cantidad != 0){
                            foundProduct.cantidad--;
                            Producto.findOneAndUpdate({
                                nombre: foundProduct.nombre
                            },foundProduct,{
                                new: true
                            }).then(()=>{
                                console.log("updated");
                            })
                            return newRecibo.save();
                        }else{
                            throw new Error("Producto sin existencias");
                        }
                    })
            }
        }).then(recibo => {
            console.log("made recibo");
            return 1;
//                .header('Location', '/index/ordenes/' + req.body.username)
//                .status(201)
//            .render('indexordenes', { usuario: myuser, productos: product });
//            .redirect(`/index/ordenes/${req.body.username}`);
        }).catch(err => {
            next(err);
        })
}

//Metodo para ver todos los recibos de un usuario redirigido despues de ordenar un producto
module.exports.getRecibosFromUsuario = async (req,res,next) => {
    var myusername = req.body.username;
    var myuser;
    await User.findOne({ username: myusername }, "-password")
        .then((foundUser) => {
            myuser = foundUser;
        })

/*    await User.findOne({
        username: myusername,
    }, "-password")
    .then((foundUser)=>{
        if(foundUser){
            myuser = foundUser;
        }
        else{
            Admin.findOne({
                username: myusername,
            },"-password")
            .then((foundAdmin) => {
                if(foundAdmin != undefined){
                    myuser = foundAdmin;
                    admin = true;
                }
            })
        }
    });*/

    var myrecibosusuario;
    var productos = [];
    await Recibo.find({ usuarioId: myuser._id })
    .then((recibosUsuario) => {
        myrecibosusuario = recibosUsuario;
    })

    var cantRecibos = myrecibosusuario.length;
    var Recibos = myrecibosusuario;
    for (let i = 0; i < cantRecibos; i++) {
        await Producto.findOne({ _id: Recibos[i].productoId })
            .then((foundProduct) => {
                productos[i] = foundProduct;
            })
    }
    return res.render('indexordenes', {title: 'ElectronicCore', usuario: myuser, productos: productos})
}

//Metodo para ver todos los recibos de un usuario llamado desde el menu de la pagina principal
module.exports.getRecibosFromMenu = async (req,res,next) => {
    console.log(req.params.username);
    var myusername = req.params.username;
    console.log("myusername " + myusername);
    var myuser;

    await User.findOne({ username: myusername }, "-password")
        .then((foundUser) => {
            console.log(foundUser);
            myuser = foundUser;
        })
    console.log("hola mundo");
    console.log(myuser);
    console.log("hola mundo2");

    var myrecibosusuario;
    var productos = [];
    await Recibo.find({ usuarioId: myuser._id })
    .then((recibosUsuario) => {
        console.log("despues de recibofindawait");
        myrecibosusuario = recibosUsuario;
    })
    console.log(myrecibosusuario.length);
    var cantRecibos = myrecibosusuario.length;
    var Recibos = myrecibosusuario;
    for (let i = 0; i < cantRecibos; i++) {
        await Producto.findOne({ _id: Recibos[i].productoId })
            .then((foundProduct) => {
                productos[i] = foundProduct;
            })
    }
    return res.render('indexordenes', {title: 'ElectronicCore', usuario: myuser, productos: productos})
}

