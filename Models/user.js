// const mongodb = require("mongodb");
// const ObjectId = mongodb.ObjectId;
// const Product = require("../models/product");

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // this is Object type
//     this._id = new ObjectId(id);
//   }
//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     const db = getDb();
//     // check product is existed in DB ?
//     const cartProductIndex = this.cart.items.findIndex((productInCart) => {
//       return productInCart.productId.toString() === product._id.toString();
//     });
//     const currentCart = [...this.cart.items];
//     // if existed, just increase the quantity
//     if (cartProductIndex >= 0) {
//       currentCart[cartProductIndex].quantity =
//         currentCart[cartProductIndex].quantity + 1;
//     }
//     // if don't existed, add to current cart array
//     else {
//       const productToAdd = {
//         productId: new ObjectId(product._id),
//         quantity: 1,
//       };
//       currentCart.push(productToAdd);
//     }
//     // set same structure cart
//     const updatedCart = {
//       items: currentCart,
//     };

//     // update to database
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   static findUserById(userId) {
//     const db = getDb();

//     return db
//       .collection("users")
//       .find({ _id: new ObjectId(userId) })
//       .next();
//   }

//   getCart() {
//     const db = getDb();
//     const allProdIdInCart = this.cart.items.map((product) => {
//       return product.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: allProdIdInCart } })
//       .toArray()
//       .then((products) => {
//         return products.map((product) => {
//           return {
//             ...product,
//             quantity: this.cart.items.find((item) => {
//               return item.productId.toString() === product._id.toString();
//             }).quantity,
//           };
//         });
//       })
//       .catch((error) => {
//         throw error;
//       });
//   }

//   deleteCartItem(id) {
//     const db = getDb();
//     const updatedCart = [...this.cart.items];
//     const idObject = new ObjectId(id);
//     // find the index of the item to be deleted
//     const index = updatedCart.findIndex((item) => {
//       return item.productId.toString() === idObject.toString();
//     });
//     if (index >= 0) {
//       // remove the item from the array
//       updatedCart.splice(index, 1);
//     }
//     return db
//       .collection("users")
//       .updateOne({ _id: this._id }, { $set: { cart: { items: updatedCart } } })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   addOrders() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart.items = [];
//         return db
//           .collection("users")
//           .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } })
//           .catch((error) => {
//             console.log(error);
//           });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new ObjectId(this._id) })
//       .toArray();
//   }
// }

// module.exports = User;
