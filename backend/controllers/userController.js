const asyncHandler = require("express-async-handler");

/**
 * @description Register a new user
 * @access      Public
 * @route       api/users
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  res.status(201).send("Register user");
});

/**
 * @description Login a user
 * @access      Public
 * @route       api/users/login
 */
const loginUser = asyncHandler(async (req, res) => {
  res.status(200).send("Login user");
});

module.exports = {
  registerUser,
  loginUser,
};
