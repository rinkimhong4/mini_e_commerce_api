const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");


  const CartItem = sequelize.define("CartItem", {
    cart_item_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    tableName: "cart_items",
    timestamps: true
  });

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.User, { foreignKey: "user_id" });
    CartItem.belongsTo(models.Product, { foreignKey: "product_id" });
  };

  module.exports = CartItem;