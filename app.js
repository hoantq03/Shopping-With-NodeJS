const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const get404 = require("./controllers/404.js");

//use expressJS
const app = express();

app.set("view engine", "ejs");

// body parser for parse request.body to json()
app.use(bodyParser.urlencoded({ extended: false }));
// public this path for access anywhere
app.use(express.static(path.join(__dirname, "public")));

// includes 2 main routes :
// '/admin'
app.use("/admin", adminRoutes);
// '/'
app.use(shopRoutes);
// Page Not Found Page
app.use(get404.pageNotFound);

// app listen at port 3000
app.listen(3000, (err) => {
  console.log("node server start on port 3000");
});
