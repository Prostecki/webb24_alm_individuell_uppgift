const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

let sequelize;

if (process.env.NODE_ENV !== "test") {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,

      // changed from sqlite to postgres
      dialect: "postgres",
      port: process.env.DB_PORT || 5432,
      logging: false, // Set to console.log to see SQL queries
      define: {
        timestamps: true,
      },
    }
  );
} else {
  sequelize = new Sequelize({
    database: "docker-uppgift",
    username: "postgres",
    password: "5432",
    host: "localhost",
    dialect: "postgres",
    logging: console.log,
  });
}

module.exports = sequelize;
