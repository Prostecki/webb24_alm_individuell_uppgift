const express = require("express");
const sequelize = require("./config/database");
const UserRouter = require("./routes/User");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Only use force:true in development
    const syncOptions =
      process.env.NODE_ENV === "development" ? { alter: true } : {};
    await sequelize.sync(syncOptions);
    console.log("Database synchronized");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();

// Routes
app.use("/users", UserRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Visit http://localhost:${port} to see the welcome page`);
});
