const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
//require user mongoose
const User = require("./models/user");
const errorController = require("./controllers/error");

const MONGODB_URI =
  "mongodb+srv://thaihoang03082003:123@cluster0.e45cmto.mongodb.net/shopnodejs";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

//my app have two routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// use session

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//use this two routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
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
