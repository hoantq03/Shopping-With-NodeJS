const { mongoose } = require("mongoose");
const Product = require("../models/product");
const { validationResult } = require("express-validator");
const ValidationError = require("../errors/ValidateError");
const ServerDown = require("../errors/ServerDown");
require("express-async-errors");
const fileHelper = require("../util/file");

// get add product form
exports.getAddProduct = (req, res, next) => {
  const value = req.session.isLoggedIn;
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isLoggedIn: value,
    hasError: false,
    errorMessage: null,
    errors: [],
  });
};

// post data from product form
exports.postAddProduct = async (req, res, next) => {
  try {
    //get all data from request send by form
    const title = req.body.title;
    const imageUrl = req.file.path;
    const price = req.body.price;
    const description = req.body.description;
    //get error from routes file whether existed
    const errorValidation = validationResult(req);
    // exist errors
    if (!errorValidation.isEmpty()) {
      throw new ValidationError(errorValidation.array());
    }

    // if user don't attached the images file, render add-product page with message error
    if (!imageUrl) {
      const product = {
        title: title,
        price: price,
        description: description,
      };
      const value = req.session.isLoggedIn;
      res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        isLoggedIn: value,
        hasError: true,
        errorMessage: "attached file is not image",
        product: product,
        errors: [],
      });
    } else {
      //// whether don't have any error, create new product with userId is current user login
      const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        //userId from user login ( session )
        userId: req.session.user,
      });
      //save products to database and then redirect to 'admin/products'
      // save() is method of mongoose, not from Product module
      await product.save();
      res.redirect("/admin/products");
    }
  } catch (error) {
    throw new ServerDown("Can not save Product to database");
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    //check edit mode is true by params of url
    const value = req.session.isLoggedIn;
    const editMode = req.query.edit;
    const imageUrl = req.body;
    if (!editMode) {
      return res.redirect("/");
    }
    //get productId from params
    const prodId = req.params.productId;

    //findById method come from Mongoose
    const product = await Product.findById(prodId);
    if (!product) {
      return res.redirect("/");
    }
    if (product.userId.toString() !== req.session.user._id.toString()) {
      return res.redirect("/admin/products");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
      isLoggedIn: value,
      hasError: false,
      errorMessage: "",
      errors: [],
    });
  } catch (error) {
    throw new ServerDown("Product can not found");
  }
};

// post new updated data
exports.postEditProduct = async (req, res, next) => {
  try {
    //get all new data from form
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;

    const prodId = req.body.productId;
    let updatedImageUrl;

    const product = await Product.findById(prodId);

    if (req.file) {
      fileHelper.deleteFile(product.imageUrl);
      updatedImageUrl = req.file.path;
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      //if exist any error, rerender add product form with red highlight input
      return res.status(422).render("admin/edit-product", {
        path: "/admin/Edit-Product",
        pageTitle: "Edit Product",
        isLoggedIn: true,
        //error includes objects
        errors: errors.array(),
        // editing to check edit or add products
        editing: true,
        // has Error to add CSS red highlight input
        hasError: true,
        // data of products to keeping data in input when rerender
        product: {
          title: updatedTitle,
          price: updatedPrice,
          description: updatedDesc,
        },
        //don't have error message in routes
        errorMessage: "invalid value",
      });
    }

    // find product and update

    if (product.userId.toString() !== req.session.user._id.toString()) {
      return res.redirect("/admin/products");
    }
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl ? updatedImageUrl : product.imageUrl;

    await product.save();

    res.redirect("/admin/products");
  } catch (error) {
    throw new ServerDown("Can not save Product to database");
  }
};

// get all products view
exports.getProducts = async (req, res, next) => {
  try {
    const value = req.session.isLoggedIn;
    const products = await Product.find({ userId: req.session.user._id });
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
      isLoggedIn: value,
      errorMessage: null,
    });
  } catch (error) {
    throw new ServerDown("Can not save Product to database");
  }
};

//delete product in database
exports.postDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    await Product.deleteOne({ _id: prodId, userId: req.session.user._id });
    res.redirect("/admin/products");
  } catch (error) {
    throw new ServerDown("Can not save Product to database");
  }
};
