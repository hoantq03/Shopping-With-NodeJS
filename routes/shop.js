const express = require("express");
// path of current file
const path = require("path");
//router
const router = express.Router();
//
const rootDir = require("../util/path");
const shopControllers = require("../controllers/shop");

router.get("/", shopControllers.getIndex);

router.get("/products", shopControllers.getProducts);

router.get("/products/:productId", shopControllers.getProduct);

router.get("/cart", shopControllers.getCart);

router.post("/cart", shopControllers.postCart);

router.get("/checkout", shopControllers.getCheckout);

router.get("/orders", shopControllers.getOrders);

module.exports = router;
