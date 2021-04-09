const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Customer = require("../models/customer");

exports.createCustomer = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
      .then(hash => {
          const customer = new Customer({
              email: req.body.email,
              username: req.body.username,
              password: hash
          });
          customer.save()
              .then(result => {
                  res.status(201).json({
                      message: 'Customer created!',
                      result: result
                  });
              })
              .catch(err => {
                  res.status(500).json({
                      message: 'Invalid authentication credentials!'
                  });
              });
      });
}

exports.customerLogin = (req, res, next) => {
  let fetchCustomer;
  Customer.findOne({email: req.body.email})
      .then(customer => {
          if(!customer) {
              return res.status(401).json({
                  message: 'Auth failed!'
              });
          }
        //   console.log('customer check: ' + customer);
          fetchCustomer = customer;
        //   console.log(req.body.password + ' and '+ customer.password);
          return bcrypt.compare(req.body.password, customer.password);
      })
      .then(result => {
          console.log('result: ' + result);
          if(!result) {
              return res.status(401).json({
                  message: 'Auth failed!'
              });
          }
          const token = jwt.sign(
              {email: fetchCustomer.email, customerId: fetchCustomer._id},
              process.env.JWT_KEY,
              {expiresIn: '1h'}
          );
          console.log('token: ' + token);

          res.status(200).json({
              token: token,
              expiresIn: 3600,
              customerId: fetchCustomer._id,
              username: fetchCustomer.username,
              created_at: fetchCustomer.created_at
          })

      })
      .catch(err => {
          return res.status(401).json({
              message: 'Auth failed!'
          });
      });
}

// exports.getUsername = (req, res, next) => {
//     User.findById(req.params.id).then(user => {
//         if (user) {
//         res.status(200).json(user);
//         } else {
//         res.status(404).json({ message: "Username not found!" });
//         }
//     });
// }

exports.getInfoCustomer = (req, res, next) => {
  console.log('res: ' + req.userData.userId);
  Customer.findById({_id: req.userData.customerId})
    .then(documents => {
        if(documents) {
            res.status(200).json(documents);
        } else {
            res.status(404).json({ message: "Not found!" });
        }
  }).catch(error => {
      res.status(500).json({
          message: "Fetching info customer failed!"
      })
  })
}

exports.updateInfo = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");

    // if(req.files.length >= 2) {
    //     iAvt = url + '/images/' + req.files[0].filename;
    //     iCover = url + '/images/' + req.files[1].filename;
    // } 
    // else if(req.files.length <= 0) {
    //     iAvt = req.body.iAvt;
    //     iCover = req.body.iCover;
    // } else {
    //     if(req.body.iAvt){
    //         iAvt = req.body.iAvt;
    //         iCover = url + '/images/' + req.files[0].filename;
    //     }
    //     if(req.body.iCover){
    //         iAvt = url + '/images/' + req.files[0].filename;
    //         iCover = req.body.iCover;
    //     }
    // }
    const infoCustomer = new Customer({
        _id: req.userData.customerId,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address
    });

    console.log(infoCustomer);

    Customer.updateOne(
        { _id: req.userData.customerId}, infoCustomer
    ).then(result => {
        res.status(200).json({
            message: 'Update info successful!',
            customerInfo: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Couldn't update info!" + error
          })
    })
}