const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const Product = require("../models/product");
const User = require("../models/user");
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log(products);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((allProductsInCart) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: allProductsInCart,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postCart = (req, res, next) => {
  // get product ID from hidden form in EJS
  const prodId = new ObjectId(req.body.productId);
  Product.fetchProduct(prodId)
    .then((product) => {
      // add this product you just have found before to cart of current user
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteCartItem(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrders()
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};
