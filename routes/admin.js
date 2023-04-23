const path = require("path");
const express = require("express");
const rootDir = require("../util/path.js");
const adminController = require("../controllers/admin.js");
const router = express.Router();

// /admin/add-product => GET ( get form to add product )
router.get("/add-product", adminController.getAddProduct);

// /admin/add-product => POST ( post data from form to save )
router.post("/add-product", adminController.postAddProduct);

// /admin/products => GET ( get form to  )
router.get("/products", adminController.adminProducts);

//
router.get("/edit-product/:productId", adminController.getEditProduct);

module.exports = router;
