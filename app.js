const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const get404 = require("./controllers/404.js");
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// includes 2 main routes : '/' and '/admin'
app.use("/admin", adminRoutes);
app.use(shopRoutes);

// Page Not Found Page
app.use(get404.pageNotFound);

app.listen(3000, (err) => {
  console.log("node server start on port 3000");
});
