const Order = require("../models/order");

exports.createOrder = (req, res, next) => {
  console.log(req);
  const order = new Order({
    nameTicket: req.body.nameTicket,
    imageTicket: req.body.imageTicket,
    dateStart: req.body.dateStart,
    dateEnd: req.body.dateEnd,
    idTicket: req.body.idTicket,
    idCreator: req.body.idCreator,
    idCustomer: req.body.idCustomer,
    itemService: req.body.itemService,
    payMethod: req.body.payMethod,
    status: req.body.status,
    isCancel: req.body.isCancel
  });
  console.log(order);
  order.save().then(createdOrder => {
    res.status(201).json({
      message: "Order added successfully",
      ticket: {
        ...createdOrder,
        id: createdOrder._id
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: 'Creating a Order failed!'
    })
  })
}

exports.updateOrder = (req, res, next) => {
  // console.log(req.body.id);
  Order.updateOne({_id: req.body.id},  { $set: { isCancel: req.body.isCancel, status: req.body.status } })
  .then(result => {
    // console.log(result);
    res.status(200).json({ message: "Update successful!" + result });
  }).catch(error => {
    res.status(500).json({
      message: 'Update failed!' + error
    });
  });
}

exports.getAllOrder = (req, res, next) => {

  const now = new Date();

    Order.find({idCustomer: req.userData.customerId}).then(documents => {
      console.log('documents.length: ' + documents.length);
      for(let i = 0; i < documents.length; i++) {
        var part = documents[i].dateEnd.split('/');
        var d = new Date(part[2] + '-'+ part[1] + '-' + part[0]);
        var checkDate = (d < now); //true => đã quá hạn
        console.log('checkDate: ' + checkDate);
        if(checkDate) {
          Order.updateOne({_id: req.userData.customerId}, {$set:{'isCancel': 'true'}}, {new: true}, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            console.log(doc);
          });
        }
      }
    });

  Order.find({idCustomer: req.userData.customerId}).then(documents => {
    res.status(200).json({
      message: "Order fetched successfully!",
      order: documents
    });
  });
}

exports.getOneOrder = (req, res, next) => {
  console.log(req.params);
  Order.findById(req.params.id).then(order => {
    if (order) {
      console.log(order);
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "order not found!" });
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching a order failed!'
    });
  });
}

exports.deleteOrder = (req, res, next) => {
  // console.log(req.params.id);
  arrId = req.params.id.split(',');
  for(let item of arrId) {
    console.log(item);
    order.deleteOne({ _id: item, idCustomer: req.userData.customerId }).then(
    result => {
      if(result.n > 0) {
        res.status(200).json({ message: "order deleted!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    }).catch(error => {
      res.status(500).json({
        message: 'Delete order failed!'
      })
    })
  }
}

exports.getCountOrderOfCustomer = (req, res, next) => {
  // console.log(req.userData);
  Order.countDocuments(
    {idCustomer: req.userData.customerId}).then(
    count => {
      // console.log(count);
      res.status(200).json({
        message: "Count item in Order",
        countOrder: count
      });
    }).catch(error => {
      res.status(500).json({
        message: 'failed!' + error
      })
    })
}

exports.getOrderOfCustomer = (req, res, next) => {
  Order.find(
    {idCustomer: req.userData.customerId}).then(
    document => {
      res.status(200).json({
        message: "Fetching order successfully!",
        order: document
      });
    }).catch(error => {
      res.status(500).json({
        message: 'failed!' + error
      })
    })
}

