const express = require("express");
const router = express.Router();

//importing the controllers
const formatController = require("../../../controllers/format/format");
const { requireSignIn } = require("../../../middlewares/auth");

router.post("/create", requireSignIn, formatController.addFormat);

router.get(
  "/doctor-wise",
  requireSignIn,
  formatController.getAllFormatsOfDoctor
);

router.put("/update/:id", requireSignIn, formatController.updateFormat);
router.delete("/delete/:id", requireSignIn, formatController.deleteFormat);

module.exports = router;
