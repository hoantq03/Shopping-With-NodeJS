const Product = require("../models/product");
const { validationResult } = require("express-validator");

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
  });
};

// post data from product form
exports.postAddProduct = (req, res, next) => {
  //get all data from request send by form
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  //get error from routes file whether existed
  const errorValidation = validationResult(req);
  console.log(errorValidation.array());
  if (!errorValidation.isEmpty()) {
    //if exist any error, rerender add product form with red highlight input
    return res.status(422).render("admin/edit-product", {
      path: "/admin/add-product",
      pageTitle: "Add Product",
      isLoggedIn: true,
      //error includes objects
      errors: errorValidation.array(),
      // editing to check edit or add products
      editing: false,
      // has Error to add CSS red highlight input
      hasError: true,
      // data of products to keeping data in input when rerender
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
      //don't have error message in routes
      errorMessage: null,
    });
  }

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
  product
    // save() is method of mongoose, not from Product module
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  //check edit mode is true by params of url
  const value = req.session.isLoggedIn;
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }
  //get productId from params
  const prodId = req.params.productId;

  //findById method come from Mongoose
  Product.findById(prodId)
    .then((product) => {
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
        errorMessage: "invalid value",
      });
    })
    .catch((err) => console.log(err));
};

// post new updated data
exports.postEditProduct = (req, res, next) => {
  //get all new data from form
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const prodId = req.body.productId;

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
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc,
      },
      //don't have error message in routes
      errorMessage: "invalid value",
    });
  }
  // find product and update
  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.session.user._id.toString()) {
        console.log(`user not`);
        return res.redirect("/admin/products");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save().then((result) => {
        console.log(`final`);
        res.redirect("/admin/products");
      });
    })

    .catch((err) => console.log(err));
};

// get all products view
exports.getProducts = (req, res, next) => {
  const value = req.session.isLoggedIn;
  Product.find({ userId: req.session.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isLoggedIn: value,
        errorMessage: null,
      });
    })
    .catch((err) => console.log(err));
};
//delete product in database
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.session.user._id })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
