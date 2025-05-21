const express = require("express");
const router = express.Router();
const { signup, home, signin } = require("../controller/userController");

//methods::
router.get("/", home);
router.post("/signup", signup);
router.post("/signin", signin);

module.exports = router;
