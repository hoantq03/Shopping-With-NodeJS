const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;
const ObjectId = mongodb.ObjectId;
const Product = require("../models/product");
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // this is Object type
    this._id = new ObjectId(id);
  }
  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const db = getDb();
    // check product is existed in DB ?
    const cartProductIndex = this.cart.items.findIndex((productInCart) => {
      return productInCart.productId.toString() === product._id.toString();
    });
    const currentCart = [...this.cart.items];
    // if existed, just increase the quantity
    if (cartProductIndex >= 0) {
      currentCart[cartProductIndex].quantity =
        currentCart[cartProductIndex].quantity + 1;
    }
    // if don't existed, add to current cart array
    else {
      const productToAdd = {
        productId: new ObjectId(product._id),
        quantity: 1,
      };
      currentCart.push(productToAdd);
    }
    // set same structure cart
    const updatedCart = {
      items: currentCart,
    };

    // update to database
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  static findUserById(userId) {
    const db = getDb();

    return db
      .collection("users")
      .find({ _id: new ObjectId(userId) })
      .next();
  }

  getCart() {
    const db = getDb();
    const allProdIdInCart = this.cart.items.map((product) => {
      return product.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: allProdIdInCart } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((item) => {
              return item.productId.toString() === product._id.toString();
            }).quantity,
          };
        });
      })
      .catch((error) => {
        throw error;
      });
  }
}

module.exports = User;
