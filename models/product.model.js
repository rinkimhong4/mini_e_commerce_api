
const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

  const Product = sequelize.define("Product", {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2),
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    category: DataTypes.STRING,
    stock: DataTypes.INTEGER
  }, {
    tableName: "products",
    timestamps: true
  });

  Product.associate = (models) => {
    Product.hasMany(models.CartItem, { foreignKey: "product_id" });
    Product.hasMany(models.OrderItem, { foreignKey: "product_id" });
  };

  module.exports = Product;


