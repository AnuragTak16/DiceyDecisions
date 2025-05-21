const express = require("express");
const router = express.Router();
const { signup, home } = require("../controller/userController");

//methods::
router.get("/", home);
router.post("/signup", signup);

module.exports = router;
