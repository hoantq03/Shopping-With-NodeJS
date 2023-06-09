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
  User.findById("6483474c6e79ccaff994fe2b")
    .then((user) => {
      req.user = user;
      console.log(req.user);
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

mongoose
  .connect(
    "mongodb+srv://thaihoang03082003:123@cluster0.e45cmto.mongodb.net/shopnodejs?retryWrites=true&w=majority"
  )
  .then((result) => {
    User.findById("6483474c6e79ccaff994fe2b")
      .then((existingUser) => {
        if (!existingUser) {
          const user = new User({
            name: "Tran Quoc Hoan",
            email: "Thaihoang03082003@gmail.com",
            cart: {
              items: [],
            },
          });
          console.log("created");
          return user.save();
        } else {
          console.log("existed");
          return existingUser;
        }
      })
      .then((user) => {
        app.listen(3000, () => {
          console.log("server is running on port 3000");
        });
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .catch((error) => {
    console.log(error);
  });
