


const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");


const User = sequelize.define("User", {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  }, {
    tableName: "users",
    timestamps: true
  });

  User.associate = (models) => {
    User.hasMany(models.Order, { foreignKey: "user_id" });
    User.hasMany(models.CartItem, { foreignKey: "user_id" });
  };

  module.exports = User;