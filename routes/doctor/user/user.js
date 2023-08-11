const express = require("express");
const router = express.Router();

const userControllers = require("../../../controllers/user/user");

//importing the controllers

router.post("/signup", userControllers.signup);
router.post("/login", userControllers.signin);

module.exports = router;
