const express = require("express");
const router = express.Router();

//importing the controllers
const tagController = require("../../../controllers/tag/tag");
const { requireSignIn } = require("../../../middlewares/auth");

router.post("/create", requireSignIn, tagController.addTag);

router.get("/doctor-wise", requireSignIn, tagController.getAllTagsOfDoctor);

module.exports = router;
