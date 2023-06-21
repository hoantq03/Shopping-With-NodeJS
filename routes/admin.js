const express = require("express");
const adminController = require("../controllers/admin");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");
require("express-async-errors");

// // /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

// edit products

// get edit form
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
//post edit data
router.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  adminController.postEditProduct
);

// delete products
router.delete("/product/:productId", isAuth, adminController.deleteProduct);

module.exports = router;
