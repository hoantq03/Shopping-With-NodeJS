const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const ServerDown = require("../errors/ServerDown");
const NotFoundError = require("../errors/notFoundError");
require("express-async-errors");

//get all products
exports.getProducts = (req, res, next) => {
  const value = req.session.isLoggedIn;
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isLoggedIn: value,
      });
    })
    .catch((err) => {
      throw new ServerDown("Can not save Product to database");
    });
};

//get one product
exports.getProduct = async (req, res, next) => {
  const value = req.session.isLoggedIn;

  try {
    const prodId = req.params.productId;
    const product = await Product.findById(prodId);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
      isLoggedIn: value,
    });
  } catch (error) {
    throw new NotFoundError("user can not be found ");
  }
};

// get all products at home pages
exports.getIndex = async (req, res, next) => {
  try {
    const value = req.session.isLoggedIn;
    const products = await Product.find();
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      isLoggedIn: value,
    });
  } catch (error) {
    throw new ServerDown("Can not save Product to database");
  }
};

//get cart products view
exports.getCart = async (req, res, next) => {
  try {
    const value = req.session.isLoggedIn;

    req.session.user = new User().init(req.session.user);
    //reference to product info by ID
    const user = await req.session.user.populate("cart.items.productId");
    const products = user.cart.items;
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: products,
      isLoggedIn: value,
    });
  } catch (error) {
    throw new ServerDown("Can not save Product to database");
  }
};

//send data to cart
exports.postCart = async (req, res, next) => {
  try {
    // get product ID from hidden form in EJS
    const prodId = req.body.productId;
    req.session.user = new User().init(req.session.user);
    const product = await Product.findById(prodId);
    // add this product you just have found before to cart of current user
    await req.session.user.addToCart(product);
    res.redirect("/cart");
  } catch (error) {
    throw new ServerDown("Can not save Product to database");
  }
};

// delete product in cart
exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    // get id from EJS
    const prodId = req.body.productId;
    req.session.user = new User().init(req.session.user);
    await req.session.user.removeFromCart(prodId);
    res.redirect("/cart");
  } catch (error) {
    throw new ServerDown("Can not save Product to database");
  }
};

// send date of product we want to order
exports.postOrder = async (req, res, next) => {
  try {
    //get all info of product by populate
    req.session.user = new User().init(req.session.user);

    const user = await req.session.user.populate("cart.items.productId");
    // map to just products detail
    // format look like :
    // user.cart : {
    // quantity : xxx,
    // products :{
    // ... all data of product
    //  }
    //}
    const products = user.cart.items.map((item) => {
      return { quantity: item.quantity, product: { ...item.productId._doc } };
    });

    //create new order document
    const order = new Order({
      user: {
        name: req.session.user.name,
        userId: req.session.user._id,
      },
      products: products,
    });
    await order.save();

    await req.session.user.clearCart();
    res.redirect("/orders");
  } catch (error) {
    throw new ServerDown("Can not save Product to database");
  }
};

// get view of orders information
exports.getOrders = async (req, res, next) => {
  try {
    const value = req.session.isLoggedIn;
    const orders = await Order.find().populate("products.product.productId");
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
      isLoggedIn: value,
    });
  } catch (error) {
    throw new ServerDown("Can not save Product to database");
  }
};
