const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    // because if we want to update product, we need to have id,
    //oppositely when we create new product, we don't need to passing id argument because mongoDB will do automatically
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      //updated Product
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  static fetchAllProducts() {
    const db = getDb();

    //find method not return a promised, it return cursor
    return db
      .collection("products")
      .find()
      .toArray()
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  static fetchProduct(id) {
    const db = getDb();
    //find method not return a promised, it return cursor
    return (
      db
        .collection("products")
        .find({ _id: new mongodb.ObjectId(id) })
        // because return cursor, so we need to point this cursor to next()
        .next()
        .then((result) => {
          return result;
        })
        .catch((error) => {
          throw error;
        })
    );
  }

  static deleteProduct(id) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: id })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

module.exports = Product;
