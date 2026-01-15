const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const Role = sequelize.define("Role", {
  role_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: "roles",
  timestamps: true
});

Role.associate = (models) => {
  Role.belongsToMany(models.User, {
    through: "user_roles",
    foreignKey: "role_id",
    otherKey: "user_id",
    as: "users"
  });
};

module.exports = Role;