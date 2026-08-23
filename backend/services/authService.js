const User = require("../models/User");
const { comparePassword } = require("../utilities/password");
const { generateToken } = require("../utilities/jwt");

const login = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await comparePassword(password, user.passwordHash);

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-passwordHash");

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

module.exports = {
  login,
  getCurrentUser,
};