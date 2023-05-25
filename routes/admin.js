const express = require("express");
const adminController = require("../controllers/admin.js");
const router = express.Router();

// /admin/add-product => GET ( get form to add product )
router.get("/add-product", adminController.getAddProduct);
// /admin/add-product => POST ( post data from form and save this data ), post method active when the form is submitted
router.post("/add-product", adminController.postAddProduct);

// /admin/products => GET ( get form to see all products )
router.get("/products", adminController.getAdminProducts);

// get Edit product view with passing the path dynamic
router.get("/edit-product/:productId", adminController.getEditProduct);
// /edit-product => POST (post data to save ), post method actice when the form is submitted
router.post("/edit-product", adminController.postEditProduct);

// export all router for app.js use
module.exports = router;
