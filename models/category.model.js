const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const Category = sequelize.define("Category", {
  category_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  categoryicon: DataTypes.STRING,
  description: DataTypes.TEXT
}, {
  tableName: "categories",
  timestamps: true,
  // paranoid: true,
});

Category.associate = (models) => {
  Category.hasMany(models.Product, {
    foreignKey: "category_id", as: "Products",
    onDelete: "CASCADE",
  
  });
};


module.exports = Category;