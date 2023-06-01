const fs = require("fs");
const path = require("path");

// path to cart.json
const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  // not all product need to add to cart, so add static keyword before function to just create one addProduct function
  static addProduct(id, product) {
    // Fetch the previous products in the cart
    fs.readFile(p, (err, fileContent) => {
      // init new cart ( don't have any products )
      let cart = { products: [], totalPrice: 0 };
      // if read file don't have error
      if (!err) {
        // read and assign all products data to cart
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      // assign this existing product to this variable
      const existingProduct = cart.products[existingProductIndex];
      // create updated variable for storage new data
      let updatedProduct;
      // if product is being existing in file
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        // just increase quantity
        updatedProduct.qty++;
        // reassign new data in updateProduct for data in file
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        // add new product with quantity = 1
        updatedProduct = { id: id, qty: 1 };
        // add new product to cart.products
        cart.products = [...cart.products, updatedProduct];
      }
      // increase price of cart
      cart.totalPrice += +product.price;
      // write all data about cart to file
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  // delete product from cart
  static deleteProduct(product) {
    // Fetch the previous products in the cart
    fs.readFile(p, (err, fileContent) => {
      // init new cart ( don't have any products )
      let cart = { products: [], totalPrice: 0 };
      // if read file don't have error
      if (!err) {
        // read and assign all products data to cart
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === product.id
      );
      // create updated variable for storage new data
      let updatedProducts;
      // if product is being existing in file
      if (existingProductIndex >= 0) {
        updatedProducts = cart;
        // subtract price * qty
        updatedProducts.totalPrice -=
          product.price * updatedProducts.products[existingProductIndex].qty;
        // delete product
        updatedProducts.products.splice(existingProductIndex, 1);
      }
      // write all data about cart to file
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static getAllProductId(cb) {
    fs.readFile(p, (err, fileContent) => {
      // init new cart ( don't have any products )
      let cart = { products: [], totalPrice: 0 };
      // if read file don't have error
      if (!err) {
        // read and assign all products data to cart
        cart = JSON.parse(fileContent);
      }
      const productIdInCart = [];
      cart.products.forEach((product) => {
        productIdInCart.push(product.id);
      });
      return cb(productIdInCart);
    });
  }
};
