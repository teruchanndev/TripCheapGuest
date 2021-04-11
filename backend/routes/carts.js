const express = require("express");

const CartController = require('../controllers/carts');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

//create 1 item cart
router.post("", checkAuth, CartController.createCart);

//update
router.put("/:id", checkAuth, CartController.updateCart);

//lấy danh sách cart
router.get("", checkAuth, CartController.getAllCart);

// router.get("/:id", checkAuth, CartController.getOneCart);

router.get("/count", checkAuth, CartController.getCountCartOfCustomer);

router.delete("", checkAuth, CartController.deleteCart );


module.exports = router;
