const express = require("express");
const { requireSignIn } = require("../../../middlewares/auth");
const router = express.Router();

//importing the controllers

router.post("/", requireSignIn, (req, res) => {
  return res
    .status(200)
    .json({ message: "dashboard accessed", user: req.user });
});

module.exports = router;
