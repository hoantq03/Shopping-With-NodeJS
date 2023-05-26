const express = require("express");
const router = express.Router();
const shopControllers = require("../controllers/shop");

/**
 * @author Quochoan_tran
 * @explain because not admin so, the path '/' or '/products' don't have POST methods, just seen, not adjust any data
 */

// get view show all products in file at the home page
router.get("/", shopControllers.getIndex);

// same as get index but in the view EJS have 'details' button
router.get("/products", shopControllers.getProducts);

// get 1 product view with dynamic path (productID)
// (the purpose of /:productId is get productId from params )
// ProductId passing from 'a' HTML tag
router.get("/products/:productId", shopControllers.getProduct);

// get cart view, show all products was being added to cart before
router.get("/cart", shopControllers.getCart);

// '/cart' ==> POST data for save cart our cart information
router.post("/cart", shopControllers.postCart);
// POST
router.post("/cart-delete-product", shopControllers.postDeleteCart);
// get checkout View
router.get("/checkout", shopControllers.getCheckout);

// get orders view
router.get("/orders", shopControllers.getOrders);

// export router of /shopController
module.exports = router;
