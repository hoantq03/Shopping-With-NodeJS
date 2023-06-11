const Product = require("../models/product");

// get add product form
exports.getAddProduct = (req, res, next) => {
  const value = req.session.isLoggedIn;
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isLoggedIn: value,
  });
};

// post data from product form
exports.postAddProduct = (req, res, next) => {
  //get all data from request send by form
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    //userId from user login ( session )
    userId: req.session.user,
  });
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
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        isLoggedIn: value,
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
  // find product and update
  Product.findById(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

// get all products view
exports.getProducts = (req, res, next) => {
  const value = req.session.isLoggedIn;

  Product.find()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isLoggedIn: value,
      });
    })
    .catch((err) => console.log(err));
};

//delete product in database
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
