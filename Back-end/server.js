const express = require("express");
const connectDB = require("./connection /DataBase");
const router = require("./routes/router");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Importing the database connection
connectDB();

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
