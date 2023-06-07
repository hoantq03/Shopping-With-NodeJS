const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      //updated Product
      dbOp = db
        .collection("products")
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, this);
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then((result) => {
        console.log(result);
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
}

module.exports = Product;
