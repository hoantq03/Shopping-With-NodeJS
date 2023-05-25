const Product = require("../Models/product");

// get add product views for path : /admin/add-product
exports.getAddProduct = (req, res) => {
  //render EJS file at path ('admin/edit-product') and passing some data
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

//post data for save product
exports.postAddProduct = (req, res) => {
  // create new product and passing data from form
  const product = new Product(
    null,
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price
  );
  // save product to file
  product.save();
  // redirect to home page
  res.redirect("/");
};

// get products view for admin to delete or edit
exports.getAdminProducts = (req, res) => {
  // fetch all data and then render all data
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "My Shop",
      path: "/admin/products",
    });
  });
};

// get edit product view with passing product id to url path dynamically
exports.getEditProduct = (req, res) => {
  // check edit mode from params ( ?edit=true ) from request.
  // the edit value come from href of 'a' tag in the EJS file (each product when render have a card)
  const editMode = req.query.edit;
  // if edit mode is false then render homepage
  if (!editMode) {
    return res.redirect("/");
  }
  // get id from param of url path
  // id data also come from 'a' tag in EJS
  const prodId = req.params.productId;
  // find this product in our file
  Product.findById(prodId, (product) => {
    // if not exist in our file, redirect to home page
    if (!product) {
      return res.redirect("/");
    }
    // if is existed in out file, render edit-product view with editing : true because
    // we have 'edit-product' EJS file for both updating and creating new product
    // so we must be check 'editing mode' for render exactly view
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/add-product",
      editing: true,
      product: product,
    });
  });
};

// post data from form 'edit-product'
exports.postEditProduct = (req, res) => {
  // create new Product with all data from form
  const updatedProduct = new Product(
    req.body.productId,
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price
  );
  // save this product to file
  updatedProduct.save();
  //redirect to home page
  res.redirect("/admin/products");
};
