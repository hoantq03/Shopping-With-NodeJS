const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

// get all products from file and passing callback function for that data
const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    // whether error are existed, return callback handling empty array, else return callback handling all products
    if (err) {
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  // save product to file
  save() {
    //get all old products from file
    getProductsFromFile((products) => {
      // check whether this id of product we want to save is existed ?
      // if already existed, we just can updated this product
      if (this.id) {
        // find the index of product by id which we want to update
        const existingProductIndex = products.findIndex(
          (product) => product.id === this.id
        );
        // copy all old data of all products by spread operator
        const updatedProduct = [...products];
        // assign new data for product which we want to update
        updatedProduct[existingProductIndex] = this;
        // write new data of all products to file
        fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
          console.log(err);
        });
        //product doesn't exist in the file
      } else {
        //we assign new id for this product
        this.id = Math.random().toString().slice(5);
        // push to products
        products.push(this);
        // write to file
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }
  // same as get products from file
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  //find product by id and return callback which handling this product
  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }

  // delete product
  static deleteProductById(productId) {
    getProductsFromFile((products) => {
      const index = products.findIndex((prod) => prod.id === productId);
      products.splice(index, 1);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }
};
