const { Sequelize } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "mini_e_commerce_db", // DB name
  process.env.DB_USER || "root", // DB user
  process.env.DB_PASSWORD || "", // DB password
  {
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "mysql",
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
  }
);

// TEST connection
sequelize
  .authenticate()
  .then(() => console.log("Sequelize connected  successfully"))
  .catch((err) => console.log("DB Error: ", err));

module.exports = sequelize;
