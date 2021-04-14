const City = require("../models/city");


exports.getAllCity = (req, res, next) => {
    City.find().then(documents => {
      res.status(200).json({
        message: "City fetched successfully!",
        cities: documents
      });
    });
  }
  
exports.getOneCity = (req, res, next) => {
    City.findById(req.params.id).then(city => {
        if (city) {
        res.status(200).json(city);
        } else {
        res.status(404).json({ message: "City not found!" });
        }
    });
}
