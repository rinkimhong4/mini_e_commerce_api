
const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

  const Product = sequelize.define("Product", {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: "products",
    timestamps: true
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, { foreignKey: "category_id", as: "Category" });
    Product.hasMany(models.CartItem, { foreignKey: "product_id", as: "CartItems" });
    Product.hasMany(models.OrderItem, { foreignKey: "product_id", as: "OrderItems" });
  };

  module.exports = Product;


