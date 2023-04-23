const Product = require("../Models/product");

// get add product views
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

//post data for save product
exports.postAddProduct = (req, res, next) => {
  const product = new Product(
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price
  );
  product.save();
  res.redirect("/");
};

// exports.products = (req, res, next) => {
//   const products = Product.fetchAll((products) => {
//     res.render("admin/products", {
//       prods: products,
//       pageTitle: "My Shop",
//       path: "/admin/products",
//     });
//   });
// };

//
// get products view for admin to delete or edit
exports.adminProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "My Shop",
      path: "/admin/products",
    });
  });
};

// get edit product view
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return redirect("/");
  }
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "",
    editing: true,
  });
};
