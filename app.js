//utils
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

//routes
const adminRoutes = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const get404 = require("./controllers/404.js");

// connect mongoDB
const mongoConnect = require("./util/database").mongoConnect;
//
//use expressJS
const app = express();

app.set("view engine", "ejs");

// body parser for parse request.body to json()
app.use(bodyParser.urlencoded({ extended: false }));

// public this path for access anywhere
app.use(express.static(path.join(__dirname, "public")));

// sending data of user to all path by "app.use()" and we can access this data every path
app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user;
  //     // call next() to continue run the path below
  //     next();
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  next();
});

// includes 2 main routes :
// '/'
// app.use(shopRoutes);
// '/admin'
app.use("/admin", adminRoutes);
// Page Not Found Page
app.use(get404.pageNotFound);
//

mongoConnect(() => {
  // app listen at port 3000
  app.listen(3000, (err) => {
    console.log("node server start on port 3000");
  });
});
