const errorHandler = (err, req, res, next) => {
  console.log(req.session.isLoggedIn);
  console.log(
    "----------------------------------ERRORS LOG------------------------------------------"
  );
  console.log("ERROR LOG ", new Date().toLocaleString());
  console.log("Request:", req.method, req.originalUrl);
  console.log("Params:", req.params);
  console.log("Body:", req.body);
  console.log("Query:", req.query);
  console.log("Error: ", err);
  console.log("Error stack: ", err.stack);
  console.log(
    "--------------------------------------------------------------------------------------"
  );

  const messageError = err.messageObject || err.message;
  // create format error response
  const error = {
    status: "Error",
    error: messageError,
  };
  const status = err.status || 400;

  // check status
  if (status === 400) {
    return res.status(status).render("404", {
      pageTitle: "Page not found",
      isLoggedIn: req.session.isLoggedIn,
      path: "/400",
    });
  }
  if (status === 404) {
    return res.status(status).render("404", {
      pageTitle: "Page Not Found",
      isLoggedIn: req.session.isLoggedIn || false,
      path: "/404",
    });
  }
  if (status === 422) {
    //if exist any error, rerender add product form with red highlight input
    return res.status(422).render("admin/edit-product", {
      path: "/admin/add-product",
      pageTitle: "Add Product",
      isLoggedIn: true,
      //error includes objects
      errors: error.error,
      // editing to check edit or add products
      editing: false,
      // has Error to add CSS red highlight input
      hasError: true,
      // data of products to keeping data in input when rerender
      product: {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description,
      },
      //don't have error message in routes
      errorMessage: "validation errors",
    });
  }

  if (status === 500) {
    return res.status(status).render("500", {
      pageTitle: "Server is down",
      isLoggedIn: req.session.isLoggedIn || false,
      path: "/500",
    });
  }
};

module.exports = errorHandler;
