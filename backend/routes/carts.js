const express = require("express");

const CartController = require('../controllers/carts');
const router = express.Router();

//create 1 item cart
router.post("", CartController.createCart);

//update
router.put("/:id", CartController.updateCart);

//lấy danh sách cart
router.get("", CartController.getAllCart);

router.get("/:id", CartController.getOneCart);

// //xóa 1 phần tử trong mảng categoryItem
// router.delete("", CartController.deleteCategoryItem );


module.exports = router;
