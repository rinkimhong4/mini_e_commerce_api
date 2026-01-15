


const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");


const User = sequelize.define("User", {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: "users",
    timestamps: true
  });

  User.associate = (models) => {
    User.hasMany(models.Order, {
      foreignKey: "user_id",
      as: "Orders",
    });

    User.hasMany(models.CartItem, {
      foreignKey: "user_id",
      as: "CartItems",
    });

    User.belongsToMany(models.Role, {
      through: "user_roles",
      foreignKey: "user_id",
      otherKey: "role_id",
      as: "roles"
    });
  };



  module.exports = User;