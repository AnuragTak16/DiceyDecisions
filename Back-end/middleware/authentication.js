const jwt = require("jsonwebtoken");
const SignupUser = require("../model/signupUser");

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  try {
    console.log("verify", jwt.verify(token, process.env.JWT_SECRET));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await SignupUser.findById(decoded.userId);
    console.log("user-1", user);

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    req.user = user; //  attaches user to request
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authenticate;
