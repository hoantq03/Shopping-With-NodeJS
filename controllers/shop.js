const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const ServerDown = require("../errors/ServerDown");
const NotFoundError = require("../errors/notFoundError");
require("express-async-errors");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const product = require("../models/product");

//get all products
exports.getProducts = async (req, res, next) => {
  const value = req.session.isLoggedIn;
  try {
    const products = await Product.find();
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
      isLoggedIn: value,
    });
  } catch (error) {
    throw new ServerDown("Can not save Product to database");
  }
};

//get one product
exports.getProduct = async (req, res, next) => {
  try {
    const value = req.session.isLoggedIn;
    const prodId = req.params.productId;
    const product = await Product.findById(prodId);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
      isLoggedIn: value,
      errors: [],
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
exports.postCart = async (req, res) => {
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
    // get id from EJS hidden input
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
      date: Date(),
    });

    await order.save();

    await req.session.user.clearCart(req.session.user);
    res.redirect("/orders");
  } catch (error) {
    throw new ServerDown("Can not save Product to database");
  }
};

// get view of orders information
exports.getOrders = async (req, res, next) => {
  try {
    const value = req.session.isLoggedIn;
    // only find orders log of current user login
    const orders = await Order.find({
      "user.userId": req.user._id,
    }).populate("products.product.productId");
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

exports.getInvoice = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const invoiceName = "invoice-" + orderId + ".pdf";
    const invoicePath = path.join("data", "invoices", invoiceName);

    const pdfDoc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="' + invoiceName + '"'
    );

    const orders = await Order.find({ _id: orderId }).populate(
      "products.product.productId"
    );
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    orders.forEach((order) => {
      pdfDoc.text(`INVOICE ORDERS ( ID : ${order._id} ) `);
      pdfDoc.text(
        "============================================================="
      );

      pdfDoc.text(
        `This is invoice of ${order.user.name} ( user id : ${order.user.userId})`
      );
      pdfDoc.text(`List Products : `);
      let total = 0;
      order.products.forEach((product) => {
        pdfDoc.text(
          `Title  : ${product.product.title} | Price : ${
            product.product.price
          } | Quantity : ${product.quantity} | Total : ${
            product.product.price * product.quantity
          }`
        );
        total = total + product.product.price * product.quantity;
      });

      pdfDoc.text(" ");
      pdfDoc.text(" ");
      pdfDoc.text("Total : " + total);

      pdfDoc.text(
        "============================================================="
      );
      pdfDoc.text(" ");
      pdfDoc.text(" ");
      pdfDoc.text(" ");
      pdfDoc.text(" ");
    });

    pdfDoc.end();

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError("Can not fount this order invoice");
    }
    if (order.user.userId.toString() !== req.user._id.toString()) {
      throw new ServerDown("unauthorized");
    }
  } catch (error) {
    throw new ServerDown("can not get order invoice");
  }
};
