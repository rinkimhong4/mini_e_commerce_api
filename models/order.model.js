

const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const Order = sequelize.define("Order", {
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "shipped", "delivered"),
      defaultValue: "pending",
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: "orders",
    timestamps: true
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: "user_id", as: "User" });
    Order.hasMany(models.OrderItem, { foreignKey: "order_id", as: "OrderItems" });
  };

  module.exports = Order;