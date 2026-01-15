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
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: "cart_items",
    timestamps: true
  });

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.User, { foreignKey: "user_id", as: "User" });
    CartItem.belongsTo(models.Product, { foreignKey: "product_id", as: "Product" });
  };

  module.exports = CartItem;
