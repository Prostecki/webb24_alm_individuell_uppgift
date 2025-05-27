// test-setup.js
process.env.NODE_ENV = "test";
const { Sequelize } = require("sequelize");

// Use a different database name for tests
const sequelize = new Sequelize({
  database: "docker-uppgift", // Use a dedicated test database
  username: "postgres",
  password: "5432",
  host: "localhost",
  dialect: "postgres",
  logging: false,
  port: 5432,
  define: {
    timestamps: true,
  },
});

// Import existing models
const UserModel = require("../src/models/User");
const AccommodationModel = require("../src/models/Accommodation");

// Recreate models with the same definition, but with our test connection
const User = sequelize.define("User", UserModel.rawAttributes, {
  timestamps: true,
});

const Accommodation = sequelize.define(
  "Accommodation",
  AccommodationModel.rawAttributes,
  {
    timestamps: true,
  }
);

// Set up associations (bidirectional)
Accommodation.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  as: "User",
});

User.hasMany(Accommodation, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  as: "Accommodations",
});

// Hooks for tests
beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully");

    // Drop tables first to ensure clean state
    await sequelize.query('DROP TABLE IF EXISTS "Accommodations" CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS "Users" CASCADE');

    // Now sync with force:true
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error("Database connection error:", error);
    console.error(error.stack);
  }
});

afterEach(async () => {
  // Clean up data after each test
  await User.destroy({ where: {}, force: true });
  await Accommodation.destroy({ where: {}, force: true });
});

afterAll(async () => {
  await sequelize.close();
});

// Export models
module.exports = {
  sequelize,
  User,
  Accommodation,
};
