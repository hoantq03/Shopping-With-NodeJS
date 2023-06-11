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
  // because this.cart.items is array, so we can use array's methods
  const cartProductIndex = this.cart.items.findIndex((productInCart) => {
    return productInCart.productId.toString() === product._id.toString();
  });
  //copy current cart
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

//remove products in cart
userSchema.methods.removeFromCart = function (id) {
  // filter product to get all products but exception the product we want to remove
  const updatedCartItem = this.cart.items.filter((item) => {
    return item.productId.toString() !== id.toString();
  });
  // updated cart after filter
  this.cart.items = updatedCartItem;
  return this.save();
};

// clear all products in cart
userSchema.methods.clearCart = function () {
  // set to empty array
  this.cart.items = [];
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
