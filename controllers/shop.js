const Product = require("../models/product");
const Order = require("../models/order");

//get all products
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
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

//get one product
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

// get all products at home pages
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

//get cart products view
exports.getCart = (req, res, next) => {
  req.user
    //reference to product info by ID
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

//send data to cart
exports.postCart = (req, res, next) => {
  // get product ID from hidden form in EJS
  const prodId = req.body.productId;
  Product.findById(prodId)
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

// delete product in cart
exports.postCartDeleteProduct = (req, res, next) => {
  // get id from EJS
  const prodId = req.body.productId;

  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

// send date of product we want to order
exports.postOrder = (req, res, next) => {
  //get all info of product by populate
  req.user
    .populate("cart.items.productId")
    .then((user) => {
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
          name: req.user.name,
          userId: req.user._id,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

// get view of orders information
exports.getOrders = (req, res, next) => {
  Order.find()
    .populate("products.product.productId")
    .then((orders) => {
      console.log(orders);
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .then(() => {
      req.user.clearCart().then((result) => {
        console.log(result);
      });
    })
    .catch((err) => console.log(err));
};
