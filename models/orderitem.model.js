const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");


  const OrderItem = sequelize.define("OrderItem", {
    order_item_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: "order_items",
    timestamps: false
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: "order_id", as: "Order" });
    OrderItem.belongsTo(models.Product, { foreignKey: "product_id", as: "Product" });
  };

  module.exports = OrderItem;
