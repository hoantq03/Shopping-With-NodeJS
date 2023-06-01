const Sequelize = require("sequelize");

const sequelize = new Sequelize("shopnodejs", "root", "123456789", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
