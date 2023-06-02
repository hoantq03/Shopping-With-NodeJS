const Product = require("../models/product");
const Cart = require("../models/cart");
const db = require("../util/database");
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
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  const userId = req.user.id;
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => console.log(error));
};

// get products view for admin to delete or edit
exports.getAdminProducts = (req, res) => {
  // fetch all data and then render all data
  // Product.findAll()
  req.user
    .getProducts()
    .then((allProducts) => {
      res.render("admin/products", {
        prods: allProducts,
        pageTitle: "My Shop",
        path: "/admin/products",
      });
    })
    .catch((error) => console.log(error));
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
  // Product.findByPk(prodId)
  req.user
    .getProducts({ where: { id: prodId } })
    .then((products) => {
      const product = products[0];
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
    })
    .catch();
};

// post data from form 'edit-product'
exports.postEditProduct = (req, res) => {
  // create new Product with all data from form
  Product.findByPk(req.body.productId)
    .then((product) => {
      product.title = req.body.title;
      product.imageUrl = req.body.imageUrl;
      product.description = req.body.description;
      product.price = req.body.price;
      return product.save();
    })
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
};

// POST delete product
exports.postDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  // find product

  Product.findByPk(productId)
    .then((product) => {
      return product.destroy();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => console.log(error));
};
