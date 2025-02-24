const express = require("express");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();

app.get("/", (req, res) => {
  res.status(201).json({message: "Hello"});
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
