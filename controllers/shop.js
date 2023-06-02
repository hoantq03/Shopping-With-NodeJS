const Product = require("../models/product");
const Cart = require("../models/cart");
// get index means get all data of products and passing this to the products(in this project, it can be call 'index.ejs') view
exports.getIndex = (req, res) => {
  // fetch all data
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((error) => console.log(error));
};

// same as get index but in the view EJS have 'details' button
exports.getProducts = (req, res) => {
  // fetch all data
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((error) => console.log(error));
};

// get 1 product view with dynamic path (productID)
exports.getProduct = (req, res) => {
  // get product id from param, and param get from the 'a' tag in EJS
  const prodId = req.params.productId;
  //find the product by ID
  Product.findByPk(prodId)
    .then((product) => {
      //then render this product by EJS file view
      res.render("shop/product-details", {
        pageTitle: product.title,
        path: "/products",
        product: product,
      });
    })
    .catch((error) => console.log(error));
};

// cart all products in the cart
exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      console.log(products);
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        prods: products,
      });
    })
    .catch((error) => console.log(error));
  console.log();
};

// post data from save to file
exports.postCart = (req, res) => {
  const productId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        //...
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      let newQuantity = 1;
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => console.log(error));
};

//delete product in cart
exports.postDeleteCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(product);
  });
  res.redirect("/cart");
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
