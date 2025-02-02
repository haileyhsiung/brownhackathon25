const express = require("express");
const mongoose = require("mongoose"); //import mongoose to connect to database
const cors = require("cors");
//express app
const app = express();
const path = require("path");
const studentRoutes = require("./routes/studentRoutes");
const dataSyncRoutes = require("./routes/dataSyncRoutes");
// Start the server
const PORT = process.env.PORT || 5001;

// Environment variable configurations
require("dotenv").config();

// use mongoose to connect to database
const MONGO_URI = process.env.MONGO_URI;

// Connect node.js to MongoDB using mongoose library
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }) //get rid of deprecation warnings
  .then(() => {
    console.log("MongoDB Connected"); // This shows up in terminal if connected

    // listen for requests only if database connection is successful
    app.listen(PORT, () => {
      // creates a server and uses http.createServer() under the hood using express
      console.log(`Listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err); // Catches error if it doesnt connect
  });

// Middleware
app.use(cors()); //not necessary if front end and back end on the same port
app.use(express.json()); //Converts the incoming request's JSON payload into a JavaScript object and attaches data to req.body

// Routes
app.use("/", studentRoutes);
app.use("/", dataSyncRoutes);

// Add periodic sync (every 1 hour)
setInterval(async () => {
  try {
    const driveData = await getDriveData();
    await Student.deleteMany({});
    await Student.insertMany(driveData);
    console.log("Periodic sync completed");
  } catch (error) {
    console.error("Auto-sync failed:", error);
  }
}, 3600000);

// allows files in client folder to be accessed from browser, only needed if we use backend port for the front end
app.use(express.static(path.join(__dirname, "client")));
