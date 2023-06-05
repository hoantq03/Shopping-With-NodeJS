const Product = require("../models/product");
const Cart = require("../models/cart");
const { postDeleteProduct } = require("./admin");
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
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        prods: products,
      });
    })
    .catch((error) => console.log(error));
};

// post data from save to file
exports.postCart = (req, res) => {
  // get id through app.use()
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      // assign fetched cart to fetchedCart variable
      fetchedCart = cart;
      console.log(cart);
      //return product which satisfied the condition
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      let oldQuantity;
      if (product) {
        oldQuantity = product.cartItems.quantity;
        newQuantity = oldQuantity + 1;
        oldQuantity++;
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
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
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products) {
        product = products[0];
      }
      product.cartItems.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((error) => {
      console.log(error);
    });
};

//post orders

exports.postOrder = (req, res) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.quantity = product.cartItems.quantity;
              product.save();
              order.save();
            })
          );
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((error) => {
      console.log(error);
    });
};

// get order
exports.getOrder = (req, res) => {
  req.user.getOrders({ include: ["products"] }).then((orders) => {
    orders[0]
      .getProducts()
      .then((products) => {
        console.log(products);
        res.render("shop/order", {
          pageTitle: "Order",
          path: "/orders",
          userName: req.user.name,
          products: products,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
