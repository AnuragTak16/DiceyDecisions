const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authentication");
const {
  signup,
  home,
  loginPage,
  createRoom,
} = require("../controller/userController");

//methods::
router.get("/", home);
router.post("/signup", signup);
router.post("/login", loginPage);
router.post("/room", authenticate, createRoom);

module.exports = router;
