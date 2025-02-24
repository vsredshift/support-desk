const registerUser = (req, res) => {
  res.status(201).send("Register user");
};

const loginUser = (req, res) => {
  res.status(200).send("Login user");
};

module.exports = {
  registerUser,
  loginUser,
};
