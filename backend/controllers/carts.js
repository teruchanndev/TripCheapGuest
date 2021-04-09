const Cart = require("../models/cart");

exports.createCart = (req, res, next) => {
  const cart = new Cart({
    nameTicket: req.body.nameTicket,
    imageTicket: req.body.imageTicket,
    price: req.body.price,
    nameService: req.body.nameService,
    dateSelect: req.body.dateSelect,
    idTicket: req.body.idTicket,
    idCustomer: req.body.idCustomer,
    idCreator: req.body.idCreator,
    itemService: req.body.itemService,
    quantity: req.body.quantity
  });
  cart.save().then(createdCart => {
    res.status(201).json({
      message: "Cart added successfully",
      cartId: createdCart._id
    });
  });
}

exports.updateCart = (req, res, next) => {
  const cart = new Cart({
    _id: req.body.id,
    nameTicket: req.body.nameTicket,
    imageTicket: req.body.imageTicket,
    price: req.body.price,
    nameService: req.body.nameService,
    dateSelect: req.body.dateSelect,
    idTicket: req.body.idTicket,
    idCustomer: req.body.idCustomer,
    idCreator: req.body.idCreator,
    itemService: req.body.itemService,
    quantity: req.body.quantity
  });
  Cart.updateOne({ _id: req.params.id }, cart).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
}

exports.getAllCart = (req, res, next) => {
  Cart.find().then(documents => {
    res.status(200).json({
      message: "Cart fetched successfully!",
      cart: documents
    });
  });
}

exports.getOneCart = (req, res, next) => {
  Cart.findById(req.params.id).then(cart => {
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Cart not found!" });
    }
  });
}

exports.deleteItemCart = (req, res, next) => {
  Cart.deleteMany({ isExist: true }).then(result => {
    console.log(result);
    res.status(200).json({
       message: "Item in cart deleted!" ,
       result: result
      });
  });
}

