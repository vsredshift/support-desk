const mongoose = require("mongoose");

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Logs the connection status to the console with color formatting.
 * If the connection fails, logs the error message and exits the process.
 * 
 * @async
 * @function connectDB
 * @throws Will terminate the process if the connection fails.
 */
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `MongoDB connected: ${connection.connection.host}`.cyan.underline
    );
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
