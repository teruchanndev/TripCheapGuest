const Cart = require("../models/cart");

exports.createCart = (req, res, next) => {
  console.log(req);
  const cart = new Cart({
    nameTicket: req.body.nameTicket,
    imageTicket: req.body.imageTicket,
    dateStart: req.body.dateStart,
    dateEnd: req.body.dateEnd,
    idTicket: req.body.idTicket,
    idCreator: req.body.idCreator,
    idCustomer: req.body.idCustomer,
    itemService: req.body.itemService
  });
  console.log(cart);
  cart.save().then(createdCart => {
    res.status(201).json({
      message: "Cart added successfully",
      ticket: {
        ...createdCart,
        id: createdCart._id
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: 'Creating a cart failed!'
    })
  })
}

exports.updateCart = (req, res, next) => {
  const cart = new Cart({
    _id: req.body.id,
    nameTicket: req.body.nameTicket,
    imageTicket: req.body.imageTicket,
    dateStart: req.body.dateStart,
    dateEnd: req.body.dateEnd,
    idTicket: req.body.idTicket,
    idCustomer: req.body.idCustomer,
    idCreator: req.body.idCreator,
    itemService: req.body.itemService
  });
  Cart.updateOne({ _id: req.params.id }, cart).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
}

exports.getAllCart = (req, res, next) => {
  console.log('req' + req);
  Cart.find({idCustomer: req.userData.customerId}).then(documents => {
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
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching a cart failed!'
    });
  });
}

exports.deleteCart = (req, res, next) => {
  Cart.deleteOne({ _id: req.params.id, idCustomer: req.userData.customerId }).then(
    result => {
    if(result.n > 0) {
      res.status(200).json({ message: "Cart deleted!" });
     } else {
      res.status(401).json({ message: "Not authorized!" });
     }
  }).catch(error => {
    res.status(500).json({
      message: 'Delete cart failed!'
    })
  })
}

exports.getCountCartOfCustomer = (req, res, next) => {
  console.log(req.userData);
  Cart.countDocuments(
    {idCustomer: req.userData.customerId}).then(
    count => {
      console.log(count);
      res.status(200).json({
        message: "Count item in cart",
        countCart: count
      });
    }).catch(error => {
      res.status(500).json({
        message: 'failed!' + error
      })
    })
}

exports.getCartOfCustomer = (req, res, next) => {
  Cart.find(
    {idCustomer: req.userData.customerId}).then(
    document => {
      res.status(200).json({
        message: "Count item in cart",
        cart: document
      });
    }).catch(error => {
      res.status(500).json({
        message: 'failed!' + error
      })
    })
}

