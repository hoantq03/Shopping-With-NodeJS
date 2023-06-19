const path = require("path");
const User = require("./models/user");
require("express-async-errors");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const errorHandler = require("./middleware/error-handler");

//require user mongoose
const MONGODB_URI =
  "mongodb+srv://thaihoang03082003:123@cluster0.e45cmto.mongodb.net/shopnodejs";

const app = express();

//store session in database
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

// set view EJS
app.set("view engine", "ejs");
app.set("views", "views");

//my app have two routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const NotFoundError = require("./errors/notFoundError");

// parser body
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

// flash to send message
app.use(flash());

// check app is logged in ?
// whether is logged in, just set user info in the session to the request
// if didn't login yet, find the user in the database and set to the session and request
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) return next();
      req.user = user;
      next();
    })
    .catch((error) => {
      throw new NotFoundError("User not found");
    });
});

//use this two routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorHandler);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("connected");
  })
  .then((user) => {
    app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((error) => {
    throw new Error(error);
  });
