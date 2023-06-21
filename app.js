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
const multer = require("multer");

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

//my app have three routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// not found page ( 404 )
const NotFoundError = require("./errors/notFoundError");

// config storage the image have two part
// firstly is destination : ( here we store in images)
// the two is file name .
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

// file filter whether file is images
//
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  )
    cb(null, true);
  else cb(null, false);
};

// parser body of request
app.use(bodyParser.json());

// set name of file and filter whether this file is images, upload file through "req.file"
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// public some folder
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

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

//use this three routes
app.use(shopRoutes);
app.use("/admin", adminRoutes);
app.use(authRoutes);

// error handler middleware
app.use(errorHandler);

// connect to the database and run the server at port  3000
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
