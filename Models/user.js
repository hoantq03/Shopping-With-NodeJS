const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
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
      productId: product._id,
      quantity: 1,
    };
    currentCart.push(productToAdd);
  }
  // set same structure cart
  const updatedCart = {
    items: currentCart,
  };
  // update to database
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (id) {
  const updatedCartItem = this.cart.items.filter((item) => {
    return item.productId.toString() !== id.toString();
  });
  this.cart.items = updatedCartItem;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart.items = [];
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

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
