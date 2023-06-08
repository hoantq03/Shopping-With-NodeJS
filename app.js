const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

// mongoDB section
const mongoConnect = require("./util/database").mongoConnect;
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

//require user
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

//

//my app have two routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findUserById(new ObjectId("648151f3c1300878ea56551c"))
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((error) => {
      console.log(error);
    });
});
//use this two routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000, () => {
    console.log("server running on 3000 port");
  });
});
