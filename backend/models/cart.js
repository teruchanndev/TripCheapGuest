const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  nameTicket: { type: String, required: true },
  imageTicket: { type: String },
  price: { type: Number },
  nameService: { type: String },
  dateSelect: { type: Date },
  idTicket: { type: String },
  idCustomer: { type: String },
  idCreator: { type: String },
  itemService: { type: Array },
  quantity: { type: Number }
});

module.exports = mongoose.model('Cart', cartSchema);