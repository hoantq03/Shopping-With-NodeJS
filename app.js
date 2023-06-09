const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

// mongoDB section
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const mongoose = require("mongoose");
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
  // User.findUserById(new ObjectId("648151f3c1300878ea56551c"))
  //   .then((user) => {
  //     req.user = new User(user.name, user.email, user.cart, user._id);
  //     console.log(req.user);
  //     next();
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  next();
});
//use this two routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://thaihoang03082003:123@cluster0.e45cmto.mongodb.net/shopnodejs?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
