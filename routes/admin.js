const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

const isAuth = require("../middleware/is-auth");
// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// // /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post("/add-product", isAuth, adminController.postAddProduct);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/edit-product", adminController.postEditProduct);

router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
