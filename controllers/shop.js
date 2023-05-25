const Product = require("../Models/product");
const Cart = require("../Models/cart");

// get index means get all data of products and passing this to the products(in this project, it can be call 'index.ejs') view
exports.getIndex = (req, res) => {
  // fetch all data
  const products = Product.fetchAll((products) => {
    //render all product with path just '/'
    res.render("shop/index", {
      prods: products,
      pageTitle: "My Shop",
      path: "/",
    });
  });
};

// same as get index but in the view EJS have 'details' button
exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

// get 1 product view with dynamic path (productID)
exports.getProduct = (req, res) => {
  // get product id from param, and param get from the 'a' tag in EJS
  const prodId = req.params.productId;
  //find the product by ID
  Product.findById(prodId, (product) => {
    //then render this product by EJS file view
    res.render("shop/product-details", {
      pageTitle: "Details Product",
      path: "/products",
      product: product,
    });
  });
};

// cart all products in the cart
exports.getCart = (req, res) => {
  res.render("shop/cart", {
    pageTitle: "Your Cart",
    path: "/cart",
  });
};

// post data from save to file
exports.postCart = (req, res) => {
  // add id to cart and the id come from form EJS (hidden type)
  const prodId = req.body.productId;
  //find this product and then call the 'Cart Model' to save this data to the file
  Product.findById(prodId, (product) => {
    // then send all data from this product to the cart.add() model
    Cart.addProduct(prodId, product);
  });
  res.redirect("/");
};

//checkout
exports.getCheckout = (req, res) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.getOrders = (req, res) => {
  res.render("shop/order", {
    pageTitle: "Your Cart",
    path: "/orders",
  });
};
