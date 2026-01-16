const Sequelize = require("./configs/database");
// const CartItem = require("./models/carditem.model");
const Category = require("./models/category.model");
// const Order = require("./models/order.model");
// const OrderItem = require("./models/orderitem.model");
// const Product = require("./models/product.model");
// const Role = require("./models/role.model");
// const UserRoles = require("./models/user_roles.model");
// const User = require("./models/user.model");


(async () => {
  try {
    await Sequelize.authenticate();
    console.log("Database connected");

    await Sequelize.sync({ alter: true });
    console.log("Migration completed successfully");

    process.exit();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
})();
