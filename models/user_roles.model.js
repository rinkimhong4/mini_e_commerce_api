const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const UserRoles = sequelize.define("UserRoles", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'role_id'
    }
  }
}, {
  tableName: "user_roles",
  timestamps: true
});

module.exports = UserRoles;