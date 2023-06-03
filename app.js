const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const get404 = require("./controllers/404.js");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
//use expressJS
const app = express();

app.set("view engine", "ejs");

// body parser for parse request.body to json()
app.use(bodyParser.urlencoded({ extended: false }));
// public this path for access anywhere
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(10)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => {
      console.log(error);
    });
});
// includes 2 main routes :
// '/'
app.use(shopRoutes);
// '/admin'
app.use("/admin", adminRoutes);
// Page Not Found Page
app.use(get404.pageNotFound);
//

// create assosiation
//Product is created by one User
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
//user can create many product
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// force to drop all table and recreate
// { force: true }
//sync all ORM code to database
await sequelize.sync();
//then we find the user login
const user = await User.findByPk(10);
// check user is existed ?
if (!user) {
  return User.create({
    name: "Tran Quoc Hoan",
    email: "Thaihoang03082003@gmail.com",
  });
}
// user is the instance of User
const cart = await user.createCart();
// app listen at port 3000
app.listen(3000, (err) => {
  console.log("node server start on port 3000");
});
