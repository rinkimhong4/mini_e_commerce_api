const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const sequelize = require("../configs/database");

const db = {};

// Load models
db.User = require("./user.model");
db.Order = require("./order.model");
db.OrderItem = require("./orderitem.model");
db.Product = require("./product.model");
db.CartItem = require("./carditem.model");
db.Category = require("./category.model");
db.Role = require("./role.model");
db.UserRoles = require("./user_roles.model");

// Apply associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
