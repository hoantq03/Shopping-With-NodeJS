const path = require("path");
const express = require("express");
const shopController = require("../controllers/shop");
const router = express.Router();
const isAuth = require("../middleware/is-auth");

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", shopController.postCart);

router.post("/cart-delete-item", shopController.postCartDeleteProduct);

router.post("/create-order", shopController.postOrder);

router.get("/orders", isAuth, shopController.getOrders);

module.exports = router;
